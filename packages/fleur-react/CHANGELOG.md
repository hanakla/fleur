### 2.0.0

#### Breaking changes

- Type `StoreGetter` moved to `@fleur/fleur`, it remove from `@fleur/fleur-react`

### 1.0.1

- [#84](https://github.com/ra-gg/fleur/pull/84) Upgrade React to 16.9
- [#84](https://github.com/ra-gg/fleur/pull/84) Migrate `react-hooks-testing-library` to `@testing-library/react-hooks`

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
