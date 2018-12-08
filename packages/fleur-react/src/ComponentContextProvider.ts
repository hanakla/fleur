import * as React from 'react'

import { ComponentContext } from '@ragg/fleur'

// `null as any` - ignore out of context case
const ComponentContextProvider = React.createContext<ComponentContext>(
  null as any,
)
export default ComponentContextProvider
