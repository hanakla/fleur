import { ActionIdentifier } from './Action'
import AppContext from './AppContext'
import { Operation, OperationArg } from './Operations'
import { StoreClass } from './Store'

class OperationContext {
  constructor(private context: AppContext) {}

  public async executeOperation<O extends Operation>(
    operator: O,
    arg: OperationArg<O>,
  ): Promise<void> {
    await this.context.executeOperation(operator, arg)
  }

  public getStore<T extends StoreClass>(storeClass: T): InstanceType<T> {
    return this.context.getStore(storeClass)
  }

  public dispatch<AI extends ActionIdentifier<any>>(
    type: AI,
    payload: ReturnType<AI>,
  ): void {
    this.context.dispatch(type, payload)
  }
}

export { OperationContext as default }
