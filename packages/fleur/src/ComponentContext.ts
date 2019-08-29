import { AppContext, StoreGetter } from './AppContext'
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

  public getStore: StoreGetter = (StoreClass: StoreClass<any>) => {
    return this.context.getStore(StoreClass)
  }

  /**
   * @internal Fleur internal API, don't use it in production
   */
  public getStoreInstance = <T extends StoreClass<any>>(StoreClass: T) => {
    return this.context.getStoreInstance(StoreClass)
  }
}
