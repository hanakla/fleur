import {
  applyPatches,
  createDraft,
  current,
  Draft,
  enablePatches,
  finishDraft,
  produceWithPatches,
} from 'immer'
import { listen, Store, StoreClass } from './Store'
import {
  OperationContext,
  OperationContextWithInternalAPI,
} from './OperationContext'
import { StoreContext } from './StoreContext'
import { DefToOperation, Operation, OperationArgs } from './Operations'
import { action, ActionIdentifier, ExtractPayloadType } from './Action'

export interface MinimalOperationContext<S> extends OperationContext {
  state: S
  updateImmediately: (proc: (state: S) => void) => void
}

export type MinOpContext<S> = OperationContext & {
  state: S
  updateImmediately: (proc: (state: S) => void) => void
}

export interface MinimalOperationDef<S> {
  (_: MinimalOperationContext<S>, ...args: any): Promise<void> | void
}

type MinOpDefToOperation<T extends MinimalOperationDef<any>> = DefToOperation<
  (_: OperationContext, ...args: OperationArgs<T>) => Promise<void> | void
>

type ListenerRegister<S> = <T extends ActionIdentifier<any>>(
  ident: T,
  producer: (draft: S, payload: ExtractPayloadType<T>) => void,
) => void

// type Ext

/**
 * Create fleur minimal ops
 *
 * * It has side-effects of calling `enablePatches()` of immer.
 */
export const minOps = <
  T extends { [action: string]: MinimalOperationDef<S> },
  S extends object
>(
  name: string,
  domain: {
    ops: T
    listens?: (lx: ListenerRegister<S>) => void
    initialState: () => S
  },
): [StoreClass<S>, { [K in keyof T]: MinOpDefToOperation<T[K]> }] => {
  enablePatches()

  const MinStore = class extends Store<S> {
    public static storeName = name
    public _state: S
    public _draft: Draft<S> | null = null

    constructor(ctx: StoreContext) {
      super(ctx)
      this._state = domain.initialState()

      // Expose latest state in draft
      Object.defineProperty(this, 'state', {
        get() {
          return this._draft ? (current(this._draft) as S) : this._state
        },
        set(s: S) {
          this._state = s
        },
      })

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

    protected updateWith(producer: (draft: Draft<S>) => void): void {
      if (this._draft) {
        throw new Error(
          'Call `updateWith` in execute operation, It will happens race condition',
        )
      }

      super.updateWith(producer)
    }
  }

  const ops: any = {}
  Object.keys(domain.ops).forEach((key) => {
    const op = async (context: OperationContext, ...args: any[]) => {
      const store = context.getStore(MinStore)
      const hasDraftOnBegin = store._draft != null
      const draft = store._draft ?? createDraft(store.state)
      store._draft = draft

      const updateImmediately = (proc: (state: S) => void) => {
        const [nextState, patches] = produceWithPatches(store.state, (d) =>
          proc(d as S),
        )
        store._state = nextState
        applyPatches(draft, patches)
      }

      let gotError = false
      try {
        await domain.ops[key](
          { ...context, state: draft as S, updateImmediately },
          ...args,
        )
      } catch (e) {
        gotError = true
        throw e
      } finally {
        // Skip committing when operation called from another operation
        if (hasDraftOnBegin) return

        const nextState = finishDraft(draft) as S
        store._draft = null

        // Skip committing when operation is aborted but finishing draft for prevent memory leak
        if (context.abort.aborted) return

        if (!gotError && store._state !== nextState) {
          store._state = nextState
          store.emitChange()
        }
      }
    }

    const abort = (context: OperationContextWithInternalAPI) => {
      return abort.byKey()(context)
    }

    abort.byKey = (key?: string) => {
      return (context: OperationContextWithInternalAPI) => {
        context
          .getExecuteMap(op as Operation)
          ?.get(key)
          ?.abort()
      }
    }

    op.abort = abort
    ops[key] = op
  })

  return [MinStore, ops]
}
