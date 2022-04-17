# @fleur/react Changelog

### 5.0.3

- [#526](https://github.com/fleur-js/fleur/pull/526) Fix shallow equaled objects judged to not shallow equals

### 5.0.2

- [#496](https://github.com/fleur-js/fleur/pull/496) Annotate this type for typescript-eslint/unbound-method (Fix #447)

### 5.0.0

See [`@fleur/fleur@3.0.0` changelog](/packages/fleur/CHANGELOG.md)

- Breaking change: Drop ES5 support (Support ES2018~)
  - `@fleur/react` bundle minified! Now it under 1.2kB(gzipped)!
  - Before this change, @fleur/react bundle is over 2kB(gzipped)
- [#322](https://github.com/fleur-js/fleur/pull/322) Breaking change: Drop old version Node.js support (v11, v13)
  - Drop testing version matrix, not guaranteed to work 
- Internal refactoring (Follow `@fleur/fleur@3.0.0`)
  - ComponentContext now build / cached in Hooks not AppContext
- Bugfix: Expose `depend` props type for `withFleurContext`

### 4.0.1

- ❗important BugFix❗ [#314](https://github.com/fleur-js/fleur/pull/314) Fix returning old select value when changes mapStoresToProps

Fixed it!

```ts
// Let userId is "1" in first rendering, "2" in next rendering
const { userId } = useParams()

// Expect to return user(id: 1) in first rendering, it works correctly
// 💥WTF💥 Expect to return user(id: 2) in next rendering, but returns user(id: 1)
const user = useStore(getStore => UserSelector.byId(getStore, userId))
```

### 4.0.0

- [#183](https://github.com/fleur-js/fleur/pull/183) in v3.3.0 was breaking change for component update rule. So bump major version.
- [#284](https://github.com/fleur-js/fleur/pull/284) Accept `null` in `useStore` at 2nd argument. It behaves always re-rendering each state update likes v3.2.0.

### 3.3.0

- [#183](https://github.com/fleur-js/fleur/pull/183) Reduce re-rendering when selected value if not changed

### 3.2.0

- [#182](https://github.com/fleur-js/fleur/pull/182) Implement dependency injection

### 3.1.0

- [#177](https://github.com/fleur-js/fleur/pull/177/files) Add ESM build

### 3.0.0

#### Feature

- [#160](https://github.com/fleur-js/fleur/pull/160) `useStore` and `connectToStores` no longer need to specify listening Store on first argument.
  Now automaticaly listening store retrieved via `getStore` (includes via selector)

  ```typescript
  // new
  const { count } = useStore(getStore => ({ count: getCount(getStore) }))

  // past
  const { count } = useStore([CounterStore], getStore => ({
    count: getCount(getStore),
  }))
  ```

### 2.0.0

#### Breaking Changes

- Package name changed to `@fleur/react`
- `StoreGetter` type removed and moved to `@fleur/fleur`

### 1.0.1

- [#84](https://github.com/fleur-js/fleur/pull/84) Upgrade React to 16.9
- [#84](https://github.com/fleur-js/fleur/pull/84) Migrate `react-hooks-testing-library` to `@testing-library/react-hooks`

### 1.0.0

- #29 Rename `useComponentContext` / `withComponentContext` to `useFleurContext` / `withFleurContext`

### 0.0.19

- #24 Fix state desynced in useStore

### 0.0.18

- #21 Improve client side performance (Store changes bounced)

### 0.0.17

- #20 Support forwardRef

### 0.0.16

- #19 FleurContext injects `unstable_batchedUpdates` into StoreContext on mounted

### 0.0.15

- #18 Shorten context prop API

### 0.0.14

- #15 Internal refactoring to using hooks
- #15 Expose `FleurContext`

### 0.0.13

- #14 Support React Hooks (`useStore`, `useComponentContext` added)

### 0.0.12

- `f6b95d` Fix typo (`StoreGettter` → `StoreGetter`)

### 0.0.11

- #12 `connectToStores` now only passing `getStore` to `mapStoresToProps` function

### 0.0.10

- #13 Accept functional component in some API on typing

### 0.0.9

- `c4964d7` Unlisten store change events when componentWillUnmount

### 0.0.8

- `7e26d63` Loosen peerDependencies versions

### 0.0.7

- `ba40c75` Use `React.Component` instead of `React.PureComponent` in `connectToStores` and `withComponentContext`

### 0.0.6

- `760a5ab` Fix connectToStores components renews each update

### 0.0.5

- `440fe27` Fix to passing received props to child component with connectToStores()

### 0.0.4

- Improve generated declarations

### 0.0.3

- Fix incorrect typing in .d.ts
- Improve connectToStores typing
- Store `cotext` prop providing with conneectToStores()

### 0.0.2

- Fix minor typing (internal)
- Fix testing
