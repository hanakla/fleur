import { AppContext } from './AppContext'
import { Operation, OperationArgs } from './Operations'
import { StoreClass } from './Store'

export class ComponentContext {
  constructor(private context: AppContext) {}

  public executeOperation = <O extends Operation>(
    operation: O,
    ...args: OperationArgs<O>
  ): void => {
    this.context.executeOperation(operation, ...args)
  }

  public getStore = <T extends StoreClass>(StoreClass: T): InstanceType<T> => {
    return this.context.getStore(StoreClass)
  }

  public subscribeState = (listener: () => void) => {
    return this.context.subscribeState(listener)
  }

  public getState = () => {
    return this.context.getState()
  }
}
