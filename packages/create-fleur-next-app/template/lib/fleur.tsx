import { createContext } from '../domains/app'
import { default as NextApp } from 'next/app'
import { FleurContext } from '@fleur/fleur-react'
import { useMemo } from 'react'

export const getOrCreateFleurContext = (state: any = null) => {
  const isServer = typeof window === 'undefined'
  const context = createContext()

  if (isServer) {
    return context
  }

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
    const context = getOrCreateFleurContext()
    ;(appContext.ctx as any).context = context

    const appProps = await App.getInitialProps(appContext)

    return {
      ...appProps,
      __FLEUR_STATE__: context.dehydrate(),
    }
  }

  return Comp
}
