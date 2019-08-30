import { default as NextApp } from 'next/app'
import { FleurContext } from '@fleur/react'
import { useMemo } from 'react'
import { bindFleurContext } from '@fleur/next'
import { createContext } from '../domains/app'

export const getOrCreateFleurContext = (state: any = null) => {
  const isServer = typeof window === 'undefined'
  const context = createContext()

  if (state) {
    context.rehydrate(state)
  }

  return context
}

export const appWithFleurContext = (App: typeof NextApp) => {
  const Comp = ({ __FLEUR_STATE__, ...props }: any) => {
    const fleurContext = useMemo(
      () => getOrCreateFleurContext(__FLEUR_STATE__),
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
      __FLEUR_STATE__: fleurContext.dehydrate(),
    }
  }

  return Comp
}
