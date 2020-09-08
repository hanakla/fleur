import NextApp, { AppContext, AppProps, AppInitialProps } from 'next/app'
import { FleurContext } from '@fleur/react'
import { AppContext as FleurAppContext } from '@fleur/fleur'
import { useMemo } from 'react'
import {
  bindFleurContext,
  serializeContext,
  deserializeContext,
  PageContext,
} from '@fleur/next'
import { createContext } from '../domains'

type FleurNextAppContext = AppContext & { ctx: PageContext }
export type { FleurNextAppContext as FleurAppContext }

declare class ClassApp extends NextApp {
  static getInitialProps(
    appContext: FleurNextAppContext,
  ): Promise<AppInitialProps>
}

interface FunctionApp {
  (props: AppProps): JSX.Element
  getInitialProps(appContext: FleurNextAppContext): Promise<AppInitialProps>
}

const FLEUR_CONTEXT_KEY = '__FLEUR_CONTEXT__'

// Keep context static without expose to global(likes window)
const clientStatic = {}

/** Get static object only client side, otherwise always returns new object */
const getSafeClientStatic = () => {
  const isServer = typeof window === 'undefined'
  if (!isServer) return clientStatic
  return {}
}

export const getOrCreateFleurContext = (state: any = null): FleurAppContext => {
  const clientStatic = getSafeClientStatic()

  if (clientStatic[FLEUR_CONTEXT_KEY]) {
    return clientStatic[FLEUR_CONTEXT_KEY]
  }

  const context = createContext()
  if (state) context.rehydrate(state)
  clientStatic[FLEUR_CONTEXT_KEY] = context

  return context
}

export const appWithFleurContext = (App: typeof ClassApp | FunctionApp) => {
  const Comp = ({ __FLEUR_STATE__, ...props }: any) => {
    const fleurContext = useMemo(
      () => getOrCreateFleurContext(deserializeContext(__FLEUR_STATE__)),
      [],
    )

    return (
      <FleurContext value={fleurContext}>
        <App {...props} />
      </FleurContext>
    )
  }

  Comp.getInitialProps = async (nextAppContext: AppContext) => {
    const fleurContext = getOrCreateFleurContext()
    const fleurishAppContext = bindFleurContext(fleurContext, nextAppContext)

    const appProps = await App.getInitialProps(fleurishAppContext)

    return {
      ...appProps,
      __FLEUR_STATE__: serializeContext(fleurContext),
    }
  }

  return Comp
}
