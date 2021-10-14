import { createDraft, finishDraft } from 'immer'
import { Store, StoreClass } from './Store'
import {
  OperationContext,
  OperationContextWithInternalAPI,
} from './OperationContext'
import { StoreContext } from './StoreContext'
import { Operation, OperationArgs, OperationDef } from './Operations'

interface MinimalOperationDef<S> {
  (_: OperationContext & { state: S }, ...args: any[]): Promise<void> | void
}

type MinimalOperationDefToOp<T> = T extends MinimalOperationDef<any>
  ? ((_: OperationContext, ...args: OperationArgs<T>) => Promise<void> | void) &
      Operation
  : never

export const minOps = <
  T extends { [action: string]: MinimalOperationDef<S> },
  S extends any
>(
  name: string,
  domain: {
    ops: T
    initialState: () => S
  },
): [StoreClass<S>, { [K in keyof T]: MinimalOperationDefToOp<T[K]> }] => {
  const MinStore = class extends Store<S> {
    public static storeName = name
    constructor(ctx: StoreContext) {
      super(ctx)
      this.state = domain.initialState()
    }
  }

  const ops: any = {}
  Object.keys(domain.ops).forEach(key => {
    const op = (context: OperationContext, ...args: any[]) => {
      const store = context.getStore(MinStore)
      const draft = createDraft(store.state)

      domain.ops[key]({ ...context, state: draft as S }, ...args)

      const nextState = finishDraft(draft) as S

      if (store.state !== nextState) {
        store.state = nextState
        store.emitChange()
      }
    }

    const abort = (context: OperationContextWithInternalAPI) => {
      return abort.byKey()(context)
    }

    abort.byKey = (key?: string) => {
      return (context: OperationContextWithInternalAPI) => {
        context
          .getExecuteMap(op)
          ?.get(key)
          ?.abort()
      }
    }

    op.abort = abort
    ops[key] = op
  })

  return [MinStore, ops]
}
