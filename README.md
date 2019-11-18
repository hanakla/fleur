# 🌼 Fleur 🌼 [![travis](https://travis-ci.org/fleur-js/fleur.svg?branch=master)](https://travis-ci.org/fleur-js/fleur)

An Fully-typed Flux framework inspired by Fluxible.
Runs on Node / Web.

(No dependence to React. See [this](https://www.npmjs.com/package/@fleur/react) if you want to use with React.)

Social hashtag: #fleurjs

## Feature

- Comfortable to write code
  - Fully typed. Friendly to type inference.
- Next.js supported with [`create-fleur-next-app`](./packages/create-fleur-next-app)
- **Completely** Server-side rendering support
- Support React Hooks in `@fleur/react`
- Dynamic import (`import()`) support in `@fleur/route-store-dom` w/o any code transformer

## Packages

- [@fleur/fleur](./packages/fleur) - Basic flux-flow framework
- [@fleur/react](./packages/react) - Fleur react connector
- [@fleur/testing](./packages/testing) - Fleur Test helpers
- [create-fleur-next-app](./packages/create-fleur-next-app) - Create Next.js app with Fleur
- [@fleur/next](./packages/create-fleur-next-app) - Next.js integration helpers
- [@fleur/di](./packages/di) - Library independency DI function
- [@fleur/route-store-dom](./packages/route-store-dom) - Fleur DOM router
- [fleur-benchmarks](./packages/fleur-benchmarks) - Benchmarks. (Fleur vs Fluxible vs react-redux)
