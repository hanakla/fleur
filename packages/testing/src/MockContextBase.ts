import { ActionIdentifier, StoreClass } from '@fleur/fleur'
import immer, { Draft, createDraft, enableMapSet, finishDraft } from 'immer'
import { MockStore, mockStore } from './mockStore'

type ExtractState<T extends StoreClass<any>> = T extends StoreClass<infer R>
  ? R
  : never

interface StoreDeriver {
  /**
   * @param store Mock target store
   * @param modifier Patch object will be shallow assign or producer function to
   */
  <T extends StoreClass>(
    store: T,
    modifier:
      | ((state: Draft<ExtractState<T>>) => void)
      | Partial<ExtractState<T>>,
  ): void
}

interface Injecter {
  <T>(source: T, mock: T): void
}

interface DeriveController {
  (deriver: { deriveStore: StoreDeriver; injectDep: Injecter }): void
}

export class MockContextBase {
  public mockStores: readonly MockStore[] = []
  public mockObjects: Map<any, any> = new Map()
  public dispatches: { action: ActionIdentifier<any>; payload: any }[] = []

  constructor({
    stores,
    mocks,
  }: {
    stores: readonly MockStore[]
    mocks: Map<any, any>
  }) {
    enableMapSet()

    this.mockStores = stores
    this.mockObjects = mocks
  }

  public getStore = <T extends StoreClass<any>>(
    StoreClass: T,
  ): InstanceType<T> => {
    if (!StoreClass.storeName || StoreClass.storeName === '')
      throw new Error(`Store.storeName must be defined in ${StoreClass.name}`)

    const store = this.mockStores.find(
      entry => entry.name === StoreClass.storeName,
    )
    if (!store) throw new Error(`Store \`${StoreClass.storeName}\` not found`)

    return store.store as any
  }

  public depend = <T>(source: T): T => {
    return this.mockObjects.has(source) ? this.mockObjects.get(source) : source
  }

  public dispatch = <AI extends ActionIdentifier<any>>(
    action: AI,
    payload: ReturnType<AI>,
  ): void => {
    this.dispatches.push({ action, payload })
    this.mockStores.forEach(({ store }) => {
      Object.keys(store)
        .filter(
          key =>
            (store as any)[key] != null && (store as any)[key].__fleurHandler,
        )
        .forEach(key => {
          if ((store as any)[key].__action === action) {
            ;(store as any)[key].producer(payload)
          }
        })
    })
  }

  public derive(modifier?: DeriveController): this {
    const cloneStores = this.mockStores.map(entry =>
      mockStore(entry.StoreClass, entry.store.state),
    )
    const clonedMocks = new Map(this.mockObjects)

    const mockStores = createDraft(cloneStores)

    const deriveStore: StoreDeriver = (StoreClass, modifier) => {
      const mock = mockStores.find(entry => entry.name === StoreClass.storeName)

      if (!mock) {
        throw new Error(
          `deriveStore: Reference unmocked store ${StoreClass.storeName}`,
        )
      }

      if (typeof modifier === 'function') {
        mock.store.state = immer(mock.store.state, modifier)
      } else {
        mock.store.state = { ...mock.store.state, ...(modifier as object) }
      }
    }

    const injectDep = <T>(source: T, mock: T) => {
      clonedMocks.set(source, mock)
    }

    modifier?.({ deriveStore, injectDep })

    return new (this.constructor as any)({
      stores: finishDraft(mockStores),
      mocks: clonedMocks,
    })
  }
}
