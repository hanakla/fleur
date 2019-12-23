import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
} from 'react'
import { StoreClass, StoreGetter } from '@fleur/fleur'
import { useFleurContext } from './useFleurContext'

type StoreToPropMapper = (getStore: StoreGetter) => any

const canUseDOM = typeof window !== 'undefined'

const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect

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

const hasOwnKey = Object.prototype.hasOwnProperty

// Object.is polyfill
const is = (x: any, y: any): boolean => {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

const isEqual = (prev: any, next: any) => {
  if (is(prev, next)) return true
  if (typeof prev !== typeof next) return false

  if (Array.isArray(prev) && Array.isArray(next)) {
    if (prev.length !== next.length) return false

    for (const idx in prev) {
      if (!is(prev[idx], next[idx])) return false
    }
  }

  if (
    typeof prev === 'object' &&
    typeof next === 'object' &&
    prev !== null &&
    next !== null
  ) {
    for (const key in prev) {
      if (!hasOwnKey.call(next, key)) continue
      if (!is(prev[key], next[key])) return false
    }
  }

  return false
}

export const useStore = <Mapper extends StoreToPropMapper>(
  mapStoresToProps: Mapper,
  checkEquality: (
    prev: Readonly<ReturnType<Mapper>>,
    next: Readonly<ReturnType<Mapper>>,
  ) => boolean = isEqual,
): ReturnType<Mapper> => {
  const { getStore } = useFleurContext()
  const referencedStores = useRef<Set<StoreClass>>(new Set())
  const isMounted = useRef<boolean>(false)
  const latestSelectedState = useRef<ReturnType<Mapper>>()

  const [, rerender] = useReducer(s => s + 1, 0)

  const getStoreInspector = useCallback(
    <T extends StoreClass>(storeClass: T) => {
      if (!referencedStores.current.has(storeClass)) {
        referencedStores.current.add(storeClass)
        isMounted.current && getStore(storeClass).on(changeHandler)
      }

      return getStore(storeClass)
    },
    [getStore],
  )

  const selectedState = mapStoresToProps(getStoreInspector)

  const mapStoresToState = useCallback(() => {
    console.log(latestSelectedState.current!, selectedState)
    if (checkEquality(latestSelectedState.current!, selectedState)) return
    rerender({})
  }, [selectedState])

  const changeHandler = useCallback(
    // Synchronous mapping on SSR
    canUseDOM ? bounce(mapStoresToState, 10) : mapStoresToState,
    [mapStoresToState],
  )

  useIsomorphicLayoutEffect(() => {
    latestSelectedState.current = selectedState
  })

  useIsomorphicLayoutEffect(() => {
    isMounted.current = true
    referencedStores.current.forEach(store => {
      getStore(store).on(changeHandler)
    })

    return () => {
      referencedStores.current.forEach(store => {
        getStore(store).off(changeHandler)
      })
    }
  }, [changeHandler])

  return selectedState
}
