import { StoreClass, Store } from '@ragg/fleur'
import { mockStoreContext } from './mockStoreContext'

type ExtractStateType<T extends Store> = T extends Store<infer S> ? S : never

export interface MockStore {
  name: string
  store: Store<any>
}

export const mockStore = <S extends StoreClass>(
  StoreClass: S,
  partialState: Partial<ExtractStateType<InstanceType<S>>>,
): MockStore => {
  const store = new StoreClass(mockStoreContext())
  Object.assign((store as any).state, partialState)
  return { name: StoreClass.storeName, store }
}
