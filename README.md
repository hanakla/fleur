# 🌼 Fleur 🌼 [![travis](https://travis-ci.org/ra-gg/fleur.svg?branch=master)](https://travis-ci.org/ra-gg/fleur)

An Fully-typed Flux framework inspired by Fluxible.
Runs on Node / Web.

(No dependence to React. See [this](https://www.npmjs.com/package/@fleur/fleur-react) if you want to use with React.)

## Feature

- Comfortable to write code
  - Fully typed. Friendly to type inference.
- **Completely** Server-side rendering support
- Support React Hooks in `@fleur/fleur-react`
- Dynamic import (`import()`) support in `@fleur/route-store-dom` w/o any code transformer

## Packages

- [@fleur/fleur](./packages/fleur) - Basic flux-flow framework
- [@fleur/di](./packages/di) - Library independency DI function
- [@fleur/fleur-react](./packages/fleur-react) - Fleur react connector
- [@fleur/route-store-dom](./packages/route-store-dom) - Fleur DOM router
- [@fleur/test-utils](./packages/test-utils) - Fleur Test helpers
- [@fleur-benchmarks](./packages/fleur-benchmarks) - Benchmarks. (fleur vs Fluxible)
