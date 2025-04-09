import { Effect } from "effect";
import CounterValue from "../CounterValue";
import CounterError from "../CounterError";

const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const incrementCounterCharacter = (value: CounterValue<string>): Effect.Effect<CounterValue<string>, CounterError> => {
    const pos = (pos => pos < 0 || pos >= characters.length - 1 ? 0 : pos)(characters.indexOf(value.count))

    if (pos > 0 && pos % 3 === 0) {
        return Effect.fail(new CounterError("Each 3rd number is an error"));
    }
    return Effect.succeed({
        count: characters[pos + 1]
    });
}

export default incrementCounterCharacter;