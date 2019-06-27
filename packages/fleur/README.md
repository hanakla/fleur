# 🌼 Fleur 🌼 [![npm version](https://badge.fury.io/js/%40fleur%2Ffleur.svg)](https://www.npmjs.com/package/@fleur/fleur) [![travis](https://travis-ci.org/ra-gg/fleur.svg?branch=master)](https://travis-ci.org/ra-gg/fleur) ![minifiedgzip](https://badgen.net/bundlephobia/minzip/@fleur/fleur)

An Fully-typed Flux framework inspired by Fluxible.
Runs on Node / Web.

(No dependence to React. see [this](https://www.npmjs.com/package/@fleur/fleur-react) if you want to use with React.)

## Feature

- Fully typed. Friendly to type inference.
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

export class CounterStore extends Store<State> {
  public state: State = { count: 0 }

  private handleIncrease = listen(CounterActions.increase, payload => {
    // `this.updateWith` is immutable changing `this.state` with `immer.js`
    this.updateWith(draft => (draft.count += payload.amount))
  })

  private handleDecrease = listen(CounterActions.decrease, payload => {
    this.updateWith(draft => (draft.count -= payload.amount))
  })

  public get count() {
    return this.state.count
  }
}
```

```typescript
// operations.ts (Action Creator)
import { operations } from '@fleur/fleur'
import { CounterActions } from './actions.ts'

export const CounterOps = operations({
  increase(ctx, amount: number) {
    ctx.dispatch(CounterActions.increase, { amount })
  },
  decrease(ctx, amount: number) {
    ctx.dispatch(CounterActions.decrease, { amount })
  },
})
```

```typescript
// app.ts
import Fleur, { withReduxDevTools } from '@fleur/fleur'
import { CounterStore } from './store.ts'
import { CounterOps } from './operations.ts'

const app = new Fleur({
  stores: [CounterStore],
})(async () => {
  const ctx = app.createContext()

  // Enable redux-devtools if you want
  withReduxDevTools(ctx)

  await ctx.executeOperation(CounterOps.increase, 10)
  console.log(ctx.getStore(SomeStore).count) // => 10

  await ctx.executeOperation(CounterOps.decrease, 20)
  console.log(ctx.getStore(SomeStore).count) // => -10
})()
```

## How to use with React?

See [`@fleur/fleur-react`](https://www.npmjs.com/package/@fleur/fleur-react).
