import { useContext } from 'react'

import { ComponentContextProvider } from './ComponentContextProvider'

export const useFleurContext = () => {
  const context = useContext(ComponentContextProvider)
  return context
}
