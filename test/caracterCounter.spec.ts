import { Effect } from 'effect';
import { it, expect, describe } from "@effect/vitest"
import CounterCharacter from '../src/app/services/CounterCharacter';
import incrementCounterCharacter from '../src/app/implementations/incrementCounterCharacter';

describe('number counter service', () => {
    it.effect('test success', () => Effect.gen(function* () {
        const service = yield* CounterCharacter;
        const result = yield* service.increment({ count: "a" });
        expect(result.count).toBe("b");
    }).pipe(
        Effect.provideService(CounterCharacter, {
            increment: incrementCounterCharacter
        })
    ));
});