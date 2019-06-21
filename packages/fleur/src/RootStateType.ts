import { StoreClass } from './Store'

type Primitives = Function | Date | RegExp | Boolean | Number | String

// prettier-ignore
type DeepReadonly<T> =
  T extends Primitives ? T
  : T extends object ? { -readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T extends Array<infer R> ? ReadonlyArray<R>
  : T extends Map<infer K, infer V> ? ReadonlyMap<K, V>
  : T extends WeakMap<infer K, infer V> ? ReadonlyMap<K, V>
  : T extends Set<infer T> ? ReadonlySet<T>
  : T extends WeakSet<infer T> ? ReadonlySet<T>
  : T

export type RootStateType<T extends object> = {
  [K in keyof T]: T[K] extends StoreClass<infer S> ? DeepReadonly<S> : never
}
