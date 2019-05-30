import * as invariant from 'invariant'

import { AppContext } from './AppContext'
import { StoreClass } from './Store'

export interface FleurOption {
  stores?: StoreClass[] | { [storeName: string]: StoreClass }
}

export class Fleur {
  public stores: Map<string, StoreClass> = new Map()

  constructor(options: FleurOption = {}) {
    if (Array.isArray(options.stores)) {
      options.stores.forEach(StoreClass => this.registerStore(StoreClass))
    } else if (options.stores) {
      Object.entries(options.stores).forEach(([storeName, StoreClass]) =>
        this.registerStore(StoreClass, storeName),
      )
    }
  }

  public registerStore(Store: StoreClass<any>, storeName?: string): void {
    if (typeof Store.storeName !== 'string' || Store.storeName === '') {
      if (!storeName) {
        console.error('Store.storeName must be specified.', Store)
        throw new Error('Store.storeName must be specified.')
      }
    }

    const usingStoreName = (storeName || Store.storeName)!
    const storeRegistered = this.stores.has(usingStoreName)
    invariant(!storeRegistered, `Store ${Store.storeName} already registered.`)

    this.stores.set(usingStoreName, Store)
  }

  public createContext(): AppContext {
    return new AppContext(this)
  }
}
