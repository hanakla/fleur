### 1.4.0

- [#178](https://github.com/fleur-js/fleur/pull/178) Add `action.async()` action group creator function
- [#182](https://github.com/fleur-js/fleur/pull/182) Implement dependency injection

### 1.3.0

- [#177](https://github.com/fleur-js/fleur/pull/177/files) Add ESM build
- [#177](https://github.com/fleur-js/fleur/pull/177/files) Expose `Operation` and `OperationArgs` type

### 1.2.3

- [#124](https://github.com/fleur-js/fleur/pull/124) Update immer from 3.2.0 to 4.0.0

### 1.2.2

- Update module and fix internal typings

### 1.2.1

- Fix missing export (selectorWithStore)

### 1.2.0

- Add `selector()` and `selectorWithStore()`<br />
  `selectorWithStore()` is provided for compatibility.<br />
  Please think to use `selector()` first.
- Type `StoreGetter` moved from `@fleur/fleur-react`

### 1.1.2

- #86 Update immer.js to 3.2.0

### 1.1.1

- #56 Fix type error of `Type instantiation is excessively deep and possibly infinite.`
  (Update dependency: immer.js)### 1.1.0

- #31 Add `reducerStore`

### 1.0.0

- #29 Major release
  - Internal refactoring
  - #26 Bind OperationContext instance to this methods.

### 0.0.17

- #21 Improve performance on dispatch action

### 0.0.16

- #19 Store update group batched by requestAnimationFrame

### 0.0.15

- Loose production dependency version
- Enable `sideEffects: false`

### 0.0.14

- #17 Accept multiple arguments in `.executeOperation()`
  `.executeOperation((context, payload) => {})` => `.executeOperation((context, arg1, arg2) => {})`

### 0.0.13

- Trim unnecessory type argument
  - `executeOperation<Actions>()` => `executeOperation()`
  - `operation<ActionIdentifier?, Operation?>()` => `operation<Operation?>()`

### 0.0.12

- Expose `ActionIdentifier` type

### 0.0.11

- Suport Redux Devtools Extension
  ```typescript
  import Fleur, { withReduxDevTools } from '@fleur/fleur'
  const app = new Fleur({ ... })
  const context = withReduxDevTools(app.createContext())
  ```

### 0.0.9

- Update dependency (immer -> 1.8.0)

### 0.0.8

#### Behavior changes

- `Store#emitChange` is batched by `requestAnimationFrame` only client side.
  (In server side, synced not batched)

### 0.0.7

#### API Changes

- Accept action name in first argument of `action()`
  ```typescript
  const increase = action<{ amount: number }>('increase')
  ```
- Add `actions()` for auto naming actions
  ```typescript
  export const CountActions = actions('Count', {
    increase: action<{ amount: number }>(), // It names 'Count/increase'
  })
  ```
- `ExtractActionIdentifiersFromObject` renamed to `ActionsOf`

### 0.0.6

#### API Changes

- Allow to any types in Store#rehydrate,dehydrate

### 0.0.5

#### Fixes

- Fix missing async-process waiting for OperationContext#e
  xecuteOperation

### 0.0.4

#### API Changes

- Accept storeName: string in AppContext.getStore for improve debuggerbility
  No supports in another context getStore methods. (Usable only AppContext.getStore)

### 0.0.3

#### API Changes

- Accept many listener per Action in one Store

  ```ts
  // invalid in 0.0.2
  class SomeStore extends Store {
    private handleSomeAction = listen(someAction, () => {
      /* Do something */
    })
    private handleSomeAction2 = listen(someAction, () => {
      /* Do something */
    }) // error!
  }

  // Can in 0.0.3
  class SomeStore extends Store {
    private handleSomeAction = listen(someAction, () => {
      /* Do something */
    })
    private handleSomeAction2 = listen(someAction, () => {
      /* Do something */
    })
  }
  ```

### 0.0.2

#### API Changes

- Start changelog.
- Rename `Store#produce` to `Store#updateWith`.
- `static storeName = 'someStoreName'` is required for Store.

#### Fixes

- Broken store rehydration state under the Uglify
