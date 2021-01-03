import { Operation, OperationArgs } from '@fleur/fleur'
import { MockStore } from './mockStore'
import { MockContextBase } from './MockContextBase'

export class MockOperationContext extends MockContextBase {
  public executeOperation = async <O extends Operation>(
    operation: O,
    ...args: OperationArgs<O>
  ): Promise<void> => {
    await Promise.resolve(operation(this as any, ...args))
  }
}

export const mockOperationContext = ({
  stores,
  mocks,
}: {
  stores: readonly MockStore[]
  mocks: Map<any, any>
}): MockOperationContext => {
  return new MockOperationContext({ stores, mocks })
}
