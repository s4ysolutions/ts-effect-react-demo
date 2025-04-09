import { Effect } from 'effect';
import { it, expect, describe } from "@effect/vitest"
import CounterNumber from '../src/app/services/CounterNumber';
import incrementCounterNumber from '../src/app/implementations/incrementCounterNumber';

describe('number counter service', () => {
    it.effect('test success', () => Effect.gen(function* () {
        const service = yield* CounterNumber;
        const result = yield* service.increment({ count: 1 });
        expect(result.count).toBe(2);
    }).pipe(
        Effect.provideService(CounterNumber, {
            increment: incrementCounterNumber
        })
    ));
});