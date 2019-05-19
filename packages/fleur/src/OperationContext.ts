import { ActionIdentifier } from './Action'
import AppContext from './AppContext'
import { Operation, OperationArgs } from './Operations'
import { StoreClass } from './Store'

class OperationContext {
  constructor(private context: AppContext) {}

  public executeOperation = async <O extends Operation>(
    operator: O,
    ...args: OperationArgs<O>
  ): Promise<void> => {
    await this.context.executeOperation(operator, ...args)
  }

  public getStore = <T extends StoreClass>(storeClass: T): InstanceType<T> => {
    return this.context.getStore(storeClass)
  }

  public dispatch = <AI extends ActionIdentifier<any>>(
    type: AI,
    payload: ReturnType<AI>,
  ): void => {
    this.context.dispatch(type, payload)
  }
}

export { OperationContext as default }
