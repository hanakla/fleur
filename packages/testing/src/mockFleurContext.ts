import { MockStore } from './mockStore'
import { mockComponentContext } from './mockComponentContext'
import { mockOperationContext } from './mockOperationContext'
import { MockContextBase } from './MockContextBase'

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

export const mockFleurContext = ({
  stores,
  mocks = new Map(),
}: {
  stores: MockStore[]
  mocks?: Map<any, any>
}) => {
  return new MockedFleurContext({ stores, mocks })
}
