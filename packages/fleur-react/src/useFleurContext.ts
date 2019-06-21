import { useContext } from 'react'

import { AppContextProvider } from './AppContextProvider'

export const useFleurContext = () => {
  const { componentContext } = useContext(AppContextProvider)
  return { ...componentContext }
}
