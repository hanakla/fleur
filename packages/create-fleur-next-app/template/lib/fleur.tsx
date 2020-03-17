import NextApp, { AppContext, AppProps, AppInitialProps } from 'next/app'
import { FleurContext } from '@fleur/react'
import { useMemo } from 'react'
import {
  bindFleurContext,
  serializeContext,
  deserializeContext,
  PageContext,
} from '@fleur/next'
import { createContext } from '../domains'

export const getOrCreateFleurContext = (state: any = null) => {
  const isServer = typeof window === 'undefined'
  const context = createContext()

  if (state) {
    context.rehydrate(state)
  }

  return context
}

export type FleurAppContext = AppContext & { ctx: PageContext }

declare class ClassApp extends NextApp {
  static getInitialProps(appContext: FleurAppContext): Promise<AppInitialProps>
}

interface FunctionApp {
  (props: AppProps): JSX.Element
  getInitialProps(appContext: FleurAppContext): Promise<AppInitialProps>
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

  Comp.getInitialProps = async appContext => {
    const fleurContext = getOrCreateFleurContext()
    bindFleurContext(fleurContext, appContext)

    const appProps = await App.getInitialProps(appContext)

    return {
      ...appProps,
      __FLEUR_STATE__: serializeContext(fleurContext),
    }
  }

  return Comp
}
