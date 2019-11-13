import { Operation, OperationArgs } from './Operations'
import { StoreClass } from './Store'

export interface ComponentContext {
  executeOperation<O extends Operation>(
    operation: O,
    ...args: OperationArgs<O>
  ): void | undefined

  getStore<T extends StoreClass>(StoreClass: T): InstanceType<T>
}
