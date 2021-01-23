import { NextPageContext } from 'next'
import { AppContext as NextAppContext } from 'next/app'
import {
  action,
  actions,
  AppContext,
  operations,
  StoreClass,
} from '@fleur/fleur'
import superjson from 'superjson'

export interface FleurishNextPageContext extends NextPageContext {
  executeOperation: AppContext['executeOperation']
  getStore: AppContext['getStore']
  fleurContext: AppContext
}

export interface FleurishNextAppContext extends NextAppContext {
  executeOperation: AppContext['executeOperation']
  getStore: AppContext['getStore']
  fleurContext: AppContext
}

const __internalRehydrateAction = action<{ storeName: string; state: any }>(
  '@fleur/next--internalRehydrate',
)

export const withSSPDistributer = (context: AppContext) => {
  const { dispatch } = context

  context.dispatch = (ident, payload) => {
    if (ident !== __internalRehydrateAction) {
      dispatch(ident, payload)
      return
    }

    // Only dispatch to target Store
    const { storeName, state } = payload
    const store = context.getStore(storeName as string)
    const Store = store.constructor as StoreClass<any>

    const listeners =
      context.actionCallbackMap
        .get(Store)
        ?.get(NextJsActions.rehydrateServerSideProps) ?? []

    listeners.forEach((fn) => fn(state))
  }

  return context
}

export const NextJsOps = operations({
  rehydrateServerSideProps: (
    { dispatch },
    { stores }: { stores: Record<string, any> },
  ) => {
    Object.keys(stores).forEach((storeName: string) => {
      dispatch(__internalRehydrateAction, {
        storeName,
        state: stores[storeName],
      })
    })
  },
})

export const NextJsActions = actions('@fleur/next/actions', {
  rehydrateServerSideProps: action<any>(),
})

/** Add `executeOperation` and `getStore` method in NextAppContext */
export const bindFleurContext = (
  context: AppContext,
  nextContext: NextAppContext,
) => {
  // prettier-ignore
  ;(nextContext as FleurishNextAppContext).executeOperation
    = (nextContext.ctx as FleurishNextPageContext).executeOperation
    = context.executeOperation;

  // prettier-ignore
  ;(nextContext as FleurishNextAppContext).getStore
    = (nextContext.ctx as FleurishNextPageContext).getStore
    = context.getStore;

  // prettier-ignore
  ;(nextContext as FleurishNextAppContext).fleurContext
    = (nextContext.ctx as FleurishNextPageContext).fleurContext
    = context

  return nextContext as FleurishNextAppContext
}

export const serializeContext = (context: AppContext): string => {
  return superjson.stringify(context.dehydrate())
}

export const deserializeContext = (state: string | null | undefined) => {
  return state ? superjson.parse(state) : null
}
