import { Operation, OperationArgs } from '@fleur/fleur/typings/Operations'
import { MockedContext } from './MockedContext'
import { MockStore } from '../typings/mockStore'

export class MockComponentContext extends MockedContext {
  public executes: { op: Operation; args: any }[] = []

  public async executeOperation<O extends Operation>(
    operation: O,
    ...args: OperationArgs<O>
  ): Promise<void> {
    this.executes.push({ op: operation, args })
  }
}

export const mockComponentContext = (options: {
  stores: MockStore[]
}): MockComponentContext => {
  return new MockComponentContext(options.stores)
}
