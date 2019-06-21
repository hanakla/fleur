# 🌼 Fleur 🌼 [![npm version](https://badge.fury.io/js/%40fleur%2Ffleur.svg)](https://www.npmjs.com/package/@fleur/fleur) [![travis](https://travis-ci.org/ra-gg/fleur.svg?branch=master)](https://travis-ci.org/ra-gg/fleur)

An Fully-typed Flux framework inspired by Fluxible.
Runs on Node / Web.

(No dependence to React. see [this](https://www.npmjs.com/package/@fleur/fleur-react) if you want to use with React.)

## Feature

- Fully typed. Friendly to type inference
- Comfortable to write code
- Default async operations (side effector) support
- immer.js builtin Store
- Support Redux DevTools

## Example

```typescript
// actions.ts (Action typings)
import { actions, action } from '@fleur/fleur'

export const CounterActions = actions('Counter', {
    increase: action<{ amount: number }>(),
    decrease: action<{ amount: number }>(),
}
```

```typescript
// store.ts (Store)
import { listen, Store } from '@fleur/fleur'
import { CounterActions } from './actions.ts'

interface State {
  count: number
}

export class CountStore extends Store<State> {
  public state: State = { count: 0 }

  private handleIncrease = listen(CounterActions.increase, payload => {
    // `this.updateWith` is immutable changing `this.state` with `immer.js`
    this.updateWith(draft => (draft.count += payload.amount))
  })

  private handleDecrease = listen(CounterActions.decrease, payload => {
    this.updateWith(draft => (draft.count -= payload.amount))
  })
}
```

```typescript
// operations.ts (Action Creator)
import { operations } from '@fleur/fleur'
import { CounterActions } from './actions.ts'

export const CounterOps = operations({
  increase(context, amount: number) {
    context.dispatch(CounterActions.increase, { amount })
  },
  decrease(context, amount: number) {
    context.dispatch(CounterActions.decrease, { amount })
  },
})
```

```typescript
// app.ts
import Fleur, { withReduxDevTools, RootStateType } from '@fleur/fleur'
import { CountStore } from './store.ts'
import { CounterOps } from './operations.ts'

const stores = {
  counter: CountStore,
}

export RootState = RootStateType<typeof stores>

const app = new Fleur({
  stores,
})(async () => {
  const context = app.createContext()

  // Enable redux-devtools if you want
  withReduxDevTools(context)

  await context.executeOperation(CounterOps.increase, 10)
  console.log(context.getState().count) // => 10

  await context.executeOperation(CounterOps.decrease, 20)
  console.log(context.getState().count) // => -10
})()
```

## How to use with React?

See [`@fleur/fleur-react`](https://www.npmjs.com/package/@fleur/fleur-react).
