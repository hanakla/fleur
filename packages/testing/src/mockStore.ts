import { StoreClass, Store } from '@fleur/fleur'
import { mockStoreContext } from './mockStoreContext'

type ExtractStateType<T extends StoreClass> = T extends StoreClass<infer S>
  ? S
  : never

export interface MockStore {
  name: string
  store: Store<any>
  StoreClass: StoreClass<any>
}

export const mockStore = <S extends StoreClass>(
  StoreClass: S,
  partialState: Partial<ExtractStateType<S>>,
): MockStore => {
  const store = new StoreClass(mockStoreContext())
  Object.assign((store as any).state, partialState)
  return { name: StoreClass.storeName, store, StoreClass }
}
