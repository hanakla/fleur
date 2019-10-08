import { Operation, OperationArgs } from '@fleur/fleur/typings/Operations'
import { MockStore } from './mockStore'
import { MockContextBase } from './MockContextBase'
import { mockStoreContext } from './mockStoreContext'

export class MockedComponentContext extends MockContextBase {
  public executes: { op: Operation; args: any }[] = []
  protected componentContext: this = this
  protected storeContext = mockStoreContext()

  public executeOperation = async <O extends Operation>(
    operation: O,
    ...args: OperationArgs<O>
  ): Promise<void> => {
    this.executes.push({ op: operation, args })
  }
}

export const mockComponentContext = ({
  stores,
}: {
  stores: MockStore[]
}): MockedComponentContext => {
  return new MockedComponentContext({ stores })
}
