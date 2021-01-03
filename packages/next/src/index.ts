import { NextPageContext } from 'next'
import {
  AppContext as NextAppContext,
  AppProps,
  AppInitialProps,
} from 'next/app'
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

// export const appWithFleurContext = (App: )

export const serializeContext = (context: AppContext): string => {
  return superjson.stringify(context.dehydrate())
}

export const deserializeContext = (state: string | null | undefined) => {
  return state ? superjson.parse(state) : null
}
