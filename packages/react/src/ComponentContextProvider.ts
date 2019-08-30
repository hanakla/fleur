import * as React from 'react'
import { ComponentContext, AppContext } from '@fleur/fleur'
import { unstable_batchedUpdates } from 'react-dom'

// `null as any` - ignore out of context case
const ComponentContextProvider = React.createContext<ComponentContext>(
  null as any,
)

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

  return React.createElement(
    ComponentContextProvider.Provider,
    { value: value.componentContext },
    children,
  )
}

export { ComponentContextProvider, FleurContext }
