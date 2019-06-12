import { Store } from './Store'

export type RootStateType<T extends object> = {
  [K in keyof T]: T[K] extends Store<infer S> ? S : never
}
