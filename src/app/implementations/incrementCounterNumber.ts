import { Effect } from "effect";
import CounterValue from "../CounterValue";
import CounterError from "../CounterError";


const incrementCounterNumber = (value: CounterValue<number>):Effect.Effect<CounterValue<number>, CounterError> => {
    if (value.count > 0 && value.count % 3 === 0) {
        return Effect.fail(new CounterError(`${value.count}: Each 3rd click is an error`));
    }
    return Effect.succeed({
        count: value.count + 1
    });
}

export default incrementCounterNumber;