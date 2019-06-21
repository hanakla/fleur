import { AppContext } from './AppContext'
import { StoreClass } from './Store'

export interface FleurOption {
  stores: Record<string, StoreClass>
}

export class Fleur {
  public stores: Map<string, StoreClass> = new Map()
  public storeClassToName = new Map<StoreClass, string>()

  constructor(options: FleurOption) {
    Object.entries(options.stores).forEach(([storeName, StoreClass]) =>
      this.registerStore(storeName, StoreClass),
    )
  }

  public registerStore(storeName: string, Store: StoreClass<any>): void {
    this.storeClassToName.set(Store, storeName)
    this.stores.set(storeName, Store)
  }

  public createContext(): AppContext {
    return new AppContext(this)
  }
}
