import { NextPageContext } from 'next'
import { AppContext as NextAppContext } from 'next/app'
import { AppContext } from '@fleur/fleur'
import superjson from 'superjson'

/** @deprecated Use `FleurishNextPageContext` instead */
export interface PageContext extends NextPageContext {
  executeOperation: AppContext['executeOperation']
  getStore: AppContext['getStore']
}

export type FleurishNextPageContext = PageContext

export interface FleurishNextAppContext extends NextAppContext {
  executeOperation: AppContext['executeOperation']
  getStore: AppContext['getStore']
}

/** Add `executeOperation` and `getStore` method in NextAppContext */
export const bindFleurContext = (
  context: AppContext,
  nextContext: NextAppContext,
) => {
  ;(nextContext.ctx as any).executeOperation = context.executeOperation.bind(
    context,
  )
  ;(nextContext.ctx as any).getStore = context.getStore.bind(context)

  return nextContext as FleurishNextAppContext
}

export const serializeContext = (context: AppContext): string => {
  return superjson.stringify(context.dehydrate())
}

export const deserializeContext = (state: string) => {
  return superjson.parse(state)
}
