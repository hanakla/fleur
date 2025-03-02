import { Operation, OperationArgs, StoreClass } from '@fleur/fleur'
import { OperationAborter } from '@fleur/fleur/dist/Operations'
import { useEffect, useReducer } from 'react'
import { ComponentFleurContext } from './ComponentReactContext'
import { useFleurContext } from './useFleurContext'

type StoreStateGetter = <T extends StoreClass<any>>(
  StoreClass: T,
) => InstanceType<T>['state']

type KeyPromiseMap = { [key: string]: Promise<void> | void }

const contextCache = new WeakMap<
  ComponentFleurContext,
  Map<Operation, KeyPromiseMap>
>()

export const createOpSupenseHook = <
  O extends Operation & Partial<OperationAborter>,
  D,
  E
>(
  op: O,
  {
    getKey,
    getData,
    getError,
  }: {
    getKey: (args: OperationArgs<O>) => string
    getData: (get: StoreStateGetter, key: string) => D | undefined
    getError?: (get: StoreStateGetter, key: string) => E | undefined
  },
) => {
  const hook = (...args: OperationArgs<O>) => {
    const key = getKey(args)

    const x = useFleurContext()
    const data = getData((s) => x.getStore(s).state, key)
    if (data !== undefined) return data

    const caches = contextCache.get(x)
    const promiseCache =
      caches.get(op) ?? (Object.create(null) as KeyPromiseMap)
    caches.set(op, promiseCache)

    if (promiseCache[key]) throw promiseCache[key]

    return x.executeOperation((xx) => {
      promiseCache[key] = xx.executeOperation(op, ...args).then()
    })
  }

  hook.noSuspence = (...args: OperationArgs<O>) => {
    const key = getKey(args)

    const [, rerender] = useReducer((s) => s + 1, 0)
    const x = useFleurContext()

    useEffect(() => {
      return () => {
        if ('abort' in op) op.abort.byKey(key)
      }
    }, [])

    const data = getData((s) => x.getStore(s).state, key)
    const error = getError((s) => x.getStore(s).state, key)
    if (data !== undefined || error !== undefined)
      return { data, error, loading: false }

    const caches = contextCache.get(x)
    const promiseCache =
      caches.get(op) ?? (Object.create(null) as KeyPromiseMap)
    caches.set(op, promiseCache)

    if (promiseCache[key]) {
      return { data: null, error: null, loading: true }
    } else {
      x.executeOperation((xx) => {
        promiseCache[key] = xx.executeOperation(op, ...args).then(() => {
          rerender()
        })
      })

      return { data: null, error: null, loading: false }
    }
  }

  return hook
}

// const [AppStore, AppOps] = minOps('App', {
//   initialState: () => ({
//     users: {},
//   }),
//   ops: {
//     async fetchUser(x, userId: string) {
//       x.acceptAbort(userId)

//       const [user, error] = await rescue(async () =>
//         (
//           await fetch('...', { body: `?id=${userId}`, signal: x.abort.signal })
//         ).json(),
//       )

//       x.commit((draft) => {
//         if (error) draft.users[userId] = { error }
//         else draft.users[userId] = { user }
//       })
//     },
//   },
// })

// const useUser = createOpSupenseHook(AppOps.fetchUser, {
//   getKey: ([userId]) => userId,
//   getData: (get, key) => get(AppStore).users[key]?.user,
//   getError: (get, key) => get(AppStore).users[key]?.error,
// })

// const Comp = () => {
//   const user = useUser('1')
//   const { data, loading, error } = useUser.noSuspence('1')
// }
