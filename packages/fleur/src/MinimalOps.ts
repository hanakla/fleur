import immer from 'immer'
import { listen, Store, StoreClass } from './Store'
import {
  OperationContext,
  OperationContextWithInternalAPI,
} from './OperationContext'
import { StoreContext } from './StoreContext'
import { DefToOperation, OperationArgs } from './Operations'
import { action, ActionIdentifier, ExtractPayloadType } from './Action'
import { ObjectPatcher, patchObject } from './utils'

export type MinOpContext<S> = OperationContext & {
  /** Store state */
  state: DeepReadonly<S>
  /** Get latest store state */
  getState: () => DeepReadonly<S>
  /** Commit state changes into store */
  commit: (patcher: ObjectPatcher<S>) => void
  /**
   * Type only! Unwrap DeepReadonly<T> to T, no effects in runtime
   * @param t Part of freezed state or freezed state
   */
  unwrapReadonly<T extends FreezedStateMark>(t: T): UnwrapDeepReadonly<T>
}

export interface AnyMinimalOperationDef<S> {
  (_: MinOpContext<S>, ...args: any): Promise<void> | void
}

type MinOpDefToOperation<
  T extends AnyMinimalOperationDef<any>
> = DefToOperation<
  (_: OperationContext, ...args: OperationArgs<T>) => Promise<void> | void
>

type ListenerRegister<S> = <T extends ActionIdentifier<any>>(
  ident: T,
  producer: (draft: S, payload: ExtractPayloadType<T>) => void,
) => void

// prettier-ignore
// type IsReadonly<T, K extends keyof T> =
//   ((a: { readonly [P in K]: T[K] }) => void) extends (a: { [P in K]: T[K] }) => void
//   ? true
//   : false

declare const FreezeMark: unique symbol
type FreezedStateMark = typeof FreezeMark

// prettier-ignore
type DeepReadonly<T>  =
T extends string | number | boolean | symbol | undefined | null | bigint ? T
  : T extends (...args: any[]) => unknown ? T
  : T extends ReadonlyArray<infer V> ? ReadonlyArray<V> & FreezedStateMark
  : T extends ReadonlyMap<infer K, infer V> ? ReadonlyMap<K, V>  & FreezedStateMark
  : T extends ReadonlySet<infer V> ? ReadonlySet<V>  & FreezedStateMark
  : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } & FreezedStateMark
  : never

// prettier-ignore
type UnwrapDeepReadonly<T> =
  T extends FreezedStateMark & infer R ? UnwrapDeepReadonly<R>
  : T extends string | number | boolean | symbol | undefined | null | bigint ? T
  : T extends (...args: any[]) => unknown ? T
  : T extends ReadonlyArray<infer V> ? Array<V>
  : T extends ReadonlyMap<infer K, infer V> ? Map<K, V>
  : T extends ReadonlySet<infer V> ? Set<V>
  : T extends object ? { -readonly [K in keyof T]: UnwrapDeepReadonly<T[K]> }
  // : T extends symbol ? (T extends FreezedStateMark ? never : T)
  : never

const unwrapReadonly: MinOpContext<any>['unwrapReadonly'] = (v) => v as any

/**
 * Create fleur minimal ops
 *
 * * It has side-effects of calling `enablePatches()` of immer.
 */
export const minOps = <
  T extends { [action: string]: AnyMinimalOperationDef<S> },
  S extends object
>(
  name: string,
  domain: {
    ops: T
    listens?: (lx: ListenerRegister<S>) => void
    initialState: () => S
  },
): [StoreClass<S>, { [K in keyof T]: MinOpDefToOperation<T[K]> }] => {
  const MinStore = class extends Store<S> {
    public static storeName = name

    constructor(ctx: StoreContext) {
      super(ctx)
      this.state = domain.initialState()

      // Register action handlers
      let idx = 0
      domain.listens?.((ident, handler) => {
        ;(this as any)[`__handler${idx++}_${ident.name}`] = listen(
          ident,
          (payload) => {
            this.updateWith((d) => handler(d as S, payload))
          },
        )
      })
    }
  }

  const ops: any = {}
  Object.keys(domain.ops).forEach((key) => {
    const internalAction = action<any>(
      `@fleur/minOps--${name}-${key}:nextState`,
    )

    const op = async (context: OperationContext, ...args: any[]) => {
      const store = context.getStore(MinStore)

      const commit = (patcher: ObjectPatcher<S>) => {
        store.state = immer(store.state, (draft) => {
          patchObject(draft as any, patcher)
        })

        // dispatch for Redux devtools
        context.dispatch(internalAction, store.state)
        store.emitChange()
      }

      const getState = (): DeepReadonly<S> => {
        // TODO: proxyDeepFreeze(store.state)
        return store.state as DeepReadonly<S>
      }

      await domain.ops[key](
        {
          ...context,
          commit,
          state: store.state as DeepReadonly<S>,
          getState,
          unwrapReadonly,
        },
        ...args,
      )
    }

    const abort = (context: OperationContextWithInternalAPI) => {
      return abort.byKey()(context)
    }

    abort.byKey = (key?: string) => {
      return (context: OperationContextWithInternalAPI) => {
        context.getExecuteMap(op)?.get(key)?.abort()
      }
    }

    op.abort = abort
    ops[key] = op
  })

  return [MinStore, ops]
}
