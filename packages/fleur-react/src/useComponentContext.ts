import { useContext } from 'react'

import { ComponentContextProvider } from './ComponentContextProvider'

export const useComponentContext = () => {
  const context = useContext(ComponentContextProvider)
  return context
}
