export type ObjectPatcher<T> = ((object: T) => void) | Partial<T>
export const patchObject = <T extends any>(
  obj: T,
  patcher: ObjectPatcher<T>,
): T => {
  if (typeof patcher === 'function') {
    patcher(obj)
  } else {
    Object.assign(obj, patcher)
  }

  return obj
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const proxyDeepFreeze = <T extends any>(obj: T): T => {
  const handler: ProxyHandler<any> = {
    get: (target, name) => {
      const value = target[name]
      if (typeof value === 'object' && value !== null)
        return proxyDeepFreeze(value)

      return value
    },

    set: (_, _1, _2, receiver) => receiver,
    defineProperty: () => false,
    deleteProperty: () => false,
    setPrototypeOf: () => false,
    isExtensible: () => false,
    preventExtensions: () => true,
  }

  if (typeof obj === 'object' && obj !== null) return new Proxy(obj, handler)

  return obj
}
