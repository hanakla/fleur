import { Operation, OperationArgs } from '@fleur/fleur'
import { MockStore } from './mockStore'
import { MockContextBase } from './MockContextBase'
import { mockStoreContext } from './mockStoreContext'

export class MockedComponentContext extends MockContextBase {
  protected componentContext: this = this
  protected storeContext = mockStoreContext()

  public executeOperation = async <O extends Operation>(
    operation: O,
    ...args: OperationArgs<O>
  ): Promise<void> => {
    this.mock.executes.push({ op: operation, args })
  }
}

export const mockComponentContext = ({
  stores,
  mocks,
}: {
  stores: readonly MockStore[]
  mocks: Map<any, any>
}): MockedComponentContext => {
  return new MockedComponentContext({ stores, mocks })
}
