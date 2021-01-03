import { OperationArgs, OperationType } from './Operations'
import { StoreClass } from './Store'

export interface ComponentContext {
  executeOperation<O extends OperationType>(
    operation: O,
    ...args: OperationArgs<O>
  ): void

  getStore<T extends StoreClass>(StoreClass: T): InstanceType<T>

  depend<T>(o: T): T
}
