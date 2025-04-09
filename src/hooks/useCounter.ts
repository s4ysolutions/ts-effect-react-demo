import { useState } from "react";
import CounterValue from "../app/CounterValue";
import CounterNumberLive from "../app/services/CounterNumberLive";
import { Cause, Effect, Exit } from "effect";
import CounterNumber from "../app/services/CounterNumber";
import CounterError from "../app/CounterError";

let currentCounter: CounterValue<number> = { count: 0 };

const programm = Effect.gen(function* () {
    const service = yield* CounterNumber;
    const result = yield* service.increment(currentCounter);
    return result;
}).pipe(
    Effect.provide(CounterNumberLive)
)

const useCounter = (): [CounterValue<number> | CounterError, () => void] => {
    const [counter, increment] = useState<CounterValue<number>|CounterError>(currentCounter);
    return [counter, () => {
        const exit = Effect.runSyncExit(programm)
        if (Exit.isSuccess(exit)) {
            const result: CounterValue<number> = exit.value;
            currentCounter = result;
            increment(result);
        } else if (Exit.isFailure(exit)) {
            const cause: Cause.Cause<CounterError> = exit.cause;
            currentCounter = { count: currentCounter.count + 1 };
            if (Cause.isFailType(cause)) {
                increment(cause.error);
            } else {
                increment(new CounterError("Unknown error"));
            }
        } else {
            increment(new CounterError("Unknown exit"));
        }
    }];
};

export default useCounter;