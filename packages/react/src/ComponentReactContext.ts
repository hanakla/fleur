import * as React from 'react'
import { ComponentContext, AppContext } from '@fleur/fleur'
import { unstable_batchedUpdates } from './utils/batchedUpdates'

interface ComponentContextOption {
  batchedUpdate?: (cb: () => void) => void
  synchronousUpdate?: boolean
}

interface ContextValue {
  synchronousUpdate: boolean
  context: ComponentContext
}

// `null as any` - ignore out of context case
const ComponentReactContext = React.createContext<ContextValue>(null as any)

const FleurContext = ({
  value,
  children,
  options: {
    batchedUpdate = unstable_batchedUpdates,
    synchronousUpdate = false,
  } = {},
}: {
  value: AppContext
  children?: React.ReactNode
  options?: ComponentContextOption
}) => {
  React.useMemo(() => {
    value.storeContext.injectBatch(batchedUpdate)
  }, [])

  return React.createElement(
    ComponentReactContext.Provider,
    { value: { synchronousUpdate, context: value.componentContext } },
    children,
  )
}

export { ComponentReactContext, FleurContext }
