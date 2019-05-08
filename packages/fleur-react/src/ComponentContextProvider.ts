import * as React from 'react'

import { ComponentContext, AppContext } from '@ragg/fleur'

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
}) =>
  React.createElement(
    ComponentContextProvider.Provider,
    { value: value.componentContext },
    children,
  )

export { ComponentContextProvider, FleurContext }
