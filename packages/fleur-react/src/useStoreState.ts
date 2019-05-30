import { useContext, useReducer, useCallback } from 'react'
import { ComponentContextProvider } from './ComponentContextProvider'
import { bounce, canUseDOM, useIsomorphicEffect } from './utils'

type StateToPropsMapper<T> = (state: T) => any

export const useStoreState = <T extends StateToPropsMapper<any>>(
  stateToProps: T,
) => {
  const context = useContext(ComponentContextProvider)
  const [, rerender] = useReducer(s => s + 1, 0)

  const update = () => rerender({})
  const changeHandler = useCallback(canUseDOM ? bounce(update, 10) : update, [])

  useIsomorphicEffect(() => {
    const off = context.subscribeState(changeHandler)
    return off
  })

  return stateToProps(context.getState())
}
