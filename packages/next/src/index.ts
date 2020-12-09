import { NextPageContext } from 'next'
import {
  AppContext as NextAppContext,
  AppProps,
  AppInitialProps,
} from 'next/app'
import { AppContext } from '@fleur/fleur'
import serialize from 'serialize-javascript'

export interface PageContext extends NextPageContext {
  executeOperation: AppContext['executeOperation']
  getStore: AppContext['getStore']
}

export interface FleurishNextAppContext extends NextAppContext {
  executeOperation: AppContext['executeOperation']
  getStore: AppContext['getStore']
}

export type FleurNextAppContext = AppContext & { ctx: PageContext }
// export type { FleurNextAppContext as FleurAppContext }

declare class ClassApp extends NextApp {
  static getInitialProps(
    appContext: FleurNextAppContext,
  ): Promise<AppInitialProps>
}

interface FunctionApp {
  (props: AppProps): JSX.Element
  getInitialProps(appContext: FleurNextAppContext): Promise<AppInitialProps>
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

// export const appWithFleurContext = (App: )

export const serializeContext = (context: AppContext): string => {
  return serialize(context.dehydrate())
}

export const deserializeContext = (state: string) => {
  return eval(`(${state})`)
}
