import { useLayoutEffect, useEffect } from 'react'

export const canUseDOM = typeof window !== 'undefined'

export const useIsomorphicEffect = canUseDOM ? useLayoutEffect : useEffect

export const bounce = (fn: () => void, bounceTime: number) => {
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
