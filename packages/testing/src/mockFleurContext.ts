import { mockStore, MockStore } from './mockStore'
import { mockComponentContext } from './mockComponentContext'
import { mockOperationContext } from './mockOperationContext'
import { MockContextBase } from './MockContextBase'
import Fleur from '@fleur/fleur'

export class MockedFleurContext extends MockContextBase {
  public mockComponentContext() {
    return mockComponentContext({
      stores: this.mockStores,
      mocks: this.mockObjects,
    })
  }

  public mockOperationContext() {
    return mockOperationContext({
      stores: this.mockStores,
      mocks: this.mockObjects,
    })
  }
}

export const mockFleurContext = (
  options:
    | {
        stores: MockStore[]
        mocks?: Map<any, any>
      }
    | Fleur,
) => {
  if (options instanceof Fleur) {
    return new MockedFleurContext({
      stores: [...options.stores].map(([_, Store]) => mockStore(Store)),
      mocks: new Map(),
    })
  }

  return new MockedFleurContext({
    stores: options.stores,
    mocks: options.mocks,
  })
}
