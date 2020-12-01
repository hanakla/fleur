### 4.0.0

- [#317](https://github.com/fleur-js/fleur/pull/317) Update dependency `immer`
  - BREAKING: Store state freeze by default, even in production mode
  - BREAKING: Support `Map` and `Set` in Store state. immer's `enableMapSet` is enabled by default.

### 3.0.0

- [#182](https://github.com/fleur-js/fleur/pull/182) Implement dependency injection
- [#184](https://github.com/fleur-js/fleur/pull/184) Rename `operationContext.{dispatchs => dispatches}` (Fix typo)
- [#185](https://github.com/fleur-js/fleur/pull/185) Optionalize second argument of `mockStore()`

### 2.0.0

- [#104](https://github.com/fleur-js/fleur/pull/104) Support component testing.
  See [this file](https://github.com/fleur-js/fleur/tree/master/packages/testing/src/index.spec.tsx#L85) for example.

#### Breaking changes

- [#104](https://github.com/fleur-js/fleur/pull/104) `mockOperationContext()` is now privated.
  Use `mockFleurContext().mockOperationContext()` instead.

### 1.1.2

- Add `homepage` in package.json
- Change package name `@fleur/test-utils` to `@fleur/testing`

### 1.1.0

- #83 Add MockOperationContext#derive API
