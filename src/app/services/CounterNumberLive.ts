import { Layer } from "effect";
import incrementCounterNumber from "../implementations/incrementCounterNumber";
import CounterNumber from "./CounterNumber";

const CounterNumberLive = Layer.succeed(
    CounterNumber,
    CounterNumber.of({
        increment: incrementCounterNumber
    })
)

export default CounterNumberLive;