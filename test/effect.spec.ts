import { Effect } from 'effect';
import { it, expect } from "@effect/vitest"

interface CounterValue {
  count: number;
}

interface CounterError {
  readonly message: string;
}

const nextNumber = (value: CounterValue): Effect.Effect<CounterValue, CounterError> => {
  if (value.count % 3 === 0) {
    return Effect.fail({ message: "Each 3rd number is an error" });
  }
  return Effect.succeed({
    count: value.count + 1
  });
}

it.effect("test success", () => Effect.gen(function* () {
  const result = yield* nextNumber({ count: 1 });
  expect(result.count).toBe(2)
}));

/*
describe('mocha is capable to test effect', function () {
  it('effect succes and runSync', function () {
    const program: Effect.Effect<CounterValue, CounterError> = nextNumber({ count: 1 });
    const result = Effect.runSync(program);
    assert.equal(result.count, 2);
  });
  it('effect fail and runSync', function () {
    const program: Effect.Effect<CounterValue, CounterError> = nextNumber({ count: 3 });
    const result = Effect.runSyncExit(program);
    assert.isTrue(Exit.isFailure(result), "Expected the result to be a Failure");
    if (Exit.isFailure(result)) {
      const cc: Cause.Cause<CounterError> = result.cause;
      if (Cause.isFailType(cc)) {
        assert.equal(cc.error.message, "Each 3rd number is an error");
      } else {
        assert.fail("Expected the cause to be a failure");
      }
    } else {
      assert.fail("Expected the result to be a Failure");
    }
  });
  it('effect succes and runFork', async function () {
    const fiber = Effect.runFork(nextNumber({ count: 1 }));
    const result = Fiber.join(fiber)

    const p = Effect.runPromise(result);
    const result2 = await p;
    assert.equal(result2.count, 2);
  });
});
*/