import * as React from 'react'
import { AppContext } from '@fleur/fleur'
import { unstable_batchedUpdates } from 'react-dom'

// `null as any` - ignore out of context case
const AppContextProvider = React.createContext<AppContext>(null as any)

const FleurContext = ({
  value,
  children,
}: {
  value: AppContext
  children: React.ReactNode
}) => {
  React.useMemo(() => {
    value.storeContext.injectBatch(unstable_batchedUpdates as () => void)
  }, [])

  return React.createElement(AppContextProvider.Provider, { value }, children)
}

export { AppContextProvider, FleurContext }
