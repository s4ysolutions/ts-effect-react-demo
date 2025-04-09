import { Context } from "effect";
import CounterValue from "../CounterValue";
import { Effect } from "effect/Effect";
import CounterError from "../CounterError";

class CounterNumber extends Context.Tag("CounterNumber")<
    CounterNumber,
    {increment: (value: CounterValue<number>) => Effect<CounterValue<number>, CounterError>}
> () { }

export default CounterNumber;