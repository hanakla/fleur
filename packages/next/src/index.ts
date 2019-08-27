import { NextPageContext } from 'next'
import { AppContext as NextAppContext } from 'next/app'
import { AppContext } from '@fleur/fleur'

export interface PageContext extends NextPageContext {
  executeOperation: AppContext['executeOperation']
  getStore: AppContext['getStore']
}

export const bindFleurContext = (
  context: AppContext,
  nextContext: NextAppContext,
) => {
  ;(nextContext.ctx as any).executeOperation = context.executeOperation.bind(
    context,
  )
  ;(nextContext.ctx as any).getStore = context.getStore.bind(context)
}
