import { MockStore } from './mockStore'
import { mockComponentContext } from './mockComponentContext'
import { mockOperationContext } from './mockOperationContext'
import { MockContextBase } from './MockContextBase'

export class MockedFleurContext extends MockContextBase {
  public mockComponentContext() {
    return mockComponentContext({ stores: this.mockStores })
  }

  public mockOperationContext() {
    return mockOperationContext({ stores: this.mockStores })
  }
}

export const mockFleurContext = ({ stores }: { stores: MockStore[] }) => {
  return new MockedFleurContext({ stores })
}
