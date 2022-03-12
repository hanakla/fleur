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

const handler: ProxyHandler<any> = {
  get: (target, name) => {
    const value = Reflect.get(target, name)
    if (value === null || typeof value !== 'object') return value

    return proxyDeepFreeze(value)
  },

  set: () => false,
  defineProperty: () => false,
  deleteProperty: () => false,
  setPrototypeOf: () => false,
  isExtensible: () => false,
  preventExtensions: () => true,
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const proxyDeepFreeze = <T extends any>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj

  return new Proxy(obj, handler)
}
