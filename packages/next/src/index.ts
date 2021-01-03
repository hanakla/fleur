import { NextPageContext } from 'next'
import { AppContext as NextAppContext } from 'next/app'
import { AppContext } from '@fleur/fleur'
import superjson from 'superjson'

/** @deprecated Use `FleurishNextPageContext` instead */
export interface PageContext extends NextPageContext {
  executeOperation: AppContext['executeOperation']
  getStore: AppContext['getStore']
  fleurContext: AppContext
}

export type FleurishNextPageContext = PageContext

export interface FleurishNextAppContext extends NextAppContext {
  executeOperation: AppContext['executeOperation']
  getStore: AppContext['getStore']
  fleurContext: AppContext
}

/** Add `executeOperation` and `getStore` method in NextAppContext */
export const bindFleurContext = (
  context: AppContext,
  nextContext: NextAppContext,
) => {
  // prettier-ignore
  ;(nextContext as FleurishNextAppContext).executeOperation
    = (nextContext.ctx as FleurishNextPageContext).executeOperation
    = context.executeOperation.bind(context);

  // prettier-ignore
  ;(nextContext as FleurishNextAppContext).getStore
    = (nextContext.ctx as FleurishNextPageContext).getStore
    = context.getStore.bind(context);

  // prettier-ignore
  ;(nextContext as FleurishNextAppContext).fleurContext
    = (nextContext.ctx as FleurishNextPageContext).fleurContext
    = context

  return nextContext as FleurishNextAppContext
}

export const serializeContext = (context: AppContext): string => {
  return superjson.stringify(context.dehydrate())
}

export const deserializeContext = (state: string) => {
  return superjson.parse(state)
}
