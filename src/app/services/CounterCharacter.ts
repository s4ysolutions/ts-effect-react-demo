import { Context } from "effect";
import CounterValue from "../CounterValue";
import { Effect } from "effect/Effect";
import CounterError from "../CounterError";

class CounterCharacter extends Context.Tag("CounterCharacter")<
    CounterCharacter,
    {increment: (value: CounterValue<string>) => Effect<CounterValue<string>, CounterError>}
> () { }

export default CounterCharacter;