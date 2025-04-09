# TS Effect/React demo app

[Live demo](https://ts-effect-react.web.app)

## Architecture

The architectural approach is the same as in [Serbian Grammar Trainer](https://github.com/s4ysolutions/srpska-gramatika): a React-agnostic TypeScript layer for business logic, a React-based presentation layer, and a custom hook *glue layer* connecting the two.

The business logic leverages the full power of the **TS Effect** framework, while custom hooks abstract away its complexity by exposing a familiar `state`/`setState`-like API. **React** is used as the core frontend toolkit.

## Goal

The app is based on the well-known `vite` starter application featuring an incremental counter.  
The purpose of this demo is to replace the simple local state counter with an external service.

## Implementation Details

> **Disclaimer:** The implementation is intentionally over-engineered in order to showcase as many TS Effect features as possible.


### Domain models

These are the only two elements from the business logic layer that are exposed to the React layer:

```typescript
interface CounterValue<T> {
    count: T;
}

export default CounterValue;
```

```typescript
class CounterError {
    readonly message: string;
    constructor(message: string) {
        this.message = message;
    }
}

export default CounterError;
```

The use of both an interface and a class is just to get a feel for how each fits into the framework.

###  Effect

The effect that increments the counter sporadically emulates errors, as if it were an unreliable service. This way, both the success and error channels carry meaningful information.


```typescript
const incrementCounterNumber = (value: CounterValue<number>):Effect.Effect<CounterValue<number>, CounterError> => {
    if (value.count > 0 && value.count % 3 === 0) {
        return Effect.fail(new CounterError(`${value.count}: Each 3rd click is an error`));
    }
    return Effect.succeed({
        count: value.count + 1
    });
}
```

### Service

In line with TS Effect’s functional programming philosophy, the effect is kept as a standalone function. This makes it tree-shakable (i.e., unused effects can be removed during bundling). However, to enable dependency injection, the function should be wrapped in a service.

```typescript
class CounterNumber extends Context.Tag("CounterNumber")<
    CounterNumber,
    {increment: (value: CounterValue<number>) => Effect<CounterValue<number>, CounterError>}
> () { }
```

This way, it is expected to request the service by `CounterNumber` tag, and the service will provide the `increment` function. 

### Layer

Wile the service can be provided to the effect directly (useful in tests):

```typescript
    it.effect('test success', () => Effect.gen(function* () {
        const service = yield* CounterNumber;
        const result = yield* service.increment({ count: 1 });
        expect(result.count).toBe(2);
    }).pipe(
        Effect.provideService(CounterNumber, {
            increment: incrementCounterNumber
        })
    ));
```

it is worth hiding the actual implementation details behind a layer to reduce the expertise required to use the service.

```typescript
const CounterNumberLive = Layer.succeed(
    CounterNumber,
    CounterNumber.of({
        increment: incrementCounterNumber
    })
)
```

### Custom hook

The idea of custom hook is to have a state of type `CounterValue<number>` or `CounterError` and a function to increment the counter.

```typescript
//  The mutable state emulating external service
let currentCounter: CounterValue<number> = { count: 0 };

// The effect that will be executed when the increment function is called
const programm = Effect.gen(function* () {
    const service = yield* CounterNumber;
    const result = yield* service.increment(currentCounter);
    return result;
}).pipe(
    Effect.provide(CounterNumberLive)
)

// The custom hook to be used in the React component
const useCounter = (): [CounterValue<number> | CounterError, () => void] => {
    const [counter, increment] = useState<CounterValue<number>|CounterError>(currentCounter);
    return [counter, () => {
        // We know the effect can fail, so we need to use runSyncExit
        const exit = Effect.runSyncExit(programm)
        // handle the exit
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
          // should never happen
            increment(new CounterError("Unknown exit"));
        }
    }];
};
```

### React component

The React component is a simple functional component that uses the custom hook to get the counter value and the increment function. It also handles the error state by displaying an error message.

```typescript
function App() {
  // use the custom hook we've created
  const [count, increment] = useCounter()

  return (
    ...
    // call the increment function when the button is clicked
        <button onClick={increment}>
        // display the counter value or error message
          {count instanceof CounterError ? count.message : `count=${count.count}`}
        </button>
    ...
  )
```