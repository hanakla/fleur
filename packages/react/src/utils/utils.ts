import { useEffect, useLayoutEffect } from 'react'

export const canUseDOM = typeof window !== 'undefined'

export const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect

export const hasOwnKey = <O extends {}>(o: O, v: string | symbol | number) =>
  Object.prototype.hasOwnProperty.call(o, v)

// Object.is polyfill
export const is = (x: any, y: any): boolean => {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

/** Shallow equality check */
export const isEqual = (prev: any, next: any) => {
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

export const bounce = <T extends (...arg: any[]) => any>(
  fn: T,
  bounceTime: number,
) => {
  let lastExecuteTime = 0

  const bouncer = (...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastExecuteTime > bounceTime) {
      fn(...args)
      lastExecuteTime = now
    } else {
      setTimeout(bouncer, bounceTime, ...args)
    }
  }

  return bouncer
}
