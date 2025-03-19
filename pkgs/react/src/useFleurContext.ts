import { useContext } from 'react'

import { ComponentReactContext } from './ComponentReactContext'

export const useFleurContext = () => {
  const { context } = useContext(ComponentReactContext)
  return context
}

export const useInternalFleurContext = () => {
  return useContext(ComponentReactContext)
}
