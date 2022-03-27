import immer from 'immer'
import { listen, Store, StoreClass } from './Store'
import {
  OperationContext,
  OperationContextWithInternalAPI,
} from './OperationContext'
import { StoreContext } from './StoreContext'
import { DefToOperation, OperationArgs } from './Operations'
import { action, ActionIdentifier, ExtractPayloadType } from './Action'
import { ObjectPatcher, patchObject, proxyDeepFreeze } from './utils'

export type MinOpContext<S> = OperationContext & {
  state: S
  getState: () => S
  commit: (patcher: ObjectPatcher<S>) => void
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

      const getState = () => {
        return proxyDeepFreeze(store.state)
      }

      await domain.ops[key](
        { ...context, commit, state: proxyDeepFreeze(store.state), getState },
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
