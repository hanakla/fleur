### 2.0.0

- [#104](https://github.com/ra-gg/fleur/pull/104) Support component testing.  
  See [this file](https://github.com/ra-gg/fleur/tree/master/packages/testing/src/index.spec.tsx#L85) for example.

#### Breaking changes

- [#104](https://github.com/ra-gg/fleur/pull/104) `mockOperationContext()` is now privated.  
  Use `mockFleurContext().mockOperationContext()` instead.

### 1.1.2

- Add `homepage` in package.json
- Change package name `@fleur/test-utils` to `@fleur/testing`

### 1.1.0

- #83 Add MockOperationContext#derive API
