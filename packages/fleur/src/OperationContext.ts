import { ActionIdentifier } from './Action'
import { Operation, OperationArgs } from './Operations'
import { StoreClass } from './Store'
import { ExtractPayloadType } from './Action'

export interface OperationContext {
  executeOperation<O extends Operation>(
    operator: O,
    ...args: OperationArgs<O>
  ): Promise<void>

  getStore<T extends StoreClass>(storeClass: T): InstanceType<T>

  dispatch<AI extends ActionIdentifier<any>>(
    type: AI,
    payload: ExtractPayloadType<AI>,
  ): void

  getDep<T>(o: T): T
}
