import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useContext,
} from 'react'
import { AppContextProvider } from './AppContextProvider'

type StoreToPropMapper = (state: any) => any

const canUseDOM = typeof window !== 'undefined'

const useIsomorphicEffect = canUseDOM ? useLayoutEffect : useEffect

const bounce = (fn: () => void, bounceTime: number) => {
  let lastExecuteTime = 0

  const bouncer = () => {
    const now = Date.now()

    if (now - lastExecuteTime > bounceTime) {
      fn()
      lastExecuteTime = now
    } else {
      setTimeout(bouncer, bounceTime)
    }
  }

  return bouncer
}

export const useStore = <Mapper extends StoreToPropMapper>(
  mapStoresToProps: Mapper,
): ReturnType<Mapper> => {
  const appContext = useContext(AppContextProvider)
  const [, rerender] = useReducer(s => s + 1, 0)
  const mapStoresToState = () => rerender({})

  const changeHandler = useCallback(
    // Synchronous mapping on SSR
    canUseDOM ? bounce(mapStoresToState, 10) : mapStoresToState,
    [],
  )

  useIsomorphicEffect(() => {
    const off = appContext.subscribe(changeHandler)
    return off
  }, [])

  return mapStoresToProps(appContext.getState())
}
