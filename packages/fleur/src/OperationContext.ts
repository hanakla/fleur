import { ActionIdentifier } from './Action'
import { OperationArgs, Operation, OperationType } from './Operations'
import { StoreClass } from './Store'
import { ExtractPayloadType } from './Action'
import { Aborter, AborterSignal } from './Abort'

export interface OperationContext {
  executeOperation<O extends OperationType>(
    operator: O,
    ...args: OperationArgs<O>
  ): Promise<void>

  getStore<T extends StoreClass>(storeClass: T): InstanceType<T>

  dispatch<AI extends ActionIdentifier<any>>(
    type: AI,
    payload: ExtractPayloadType<AI>,
  ): void

  depend<T>(o: T): T

  abort: AborterSignal
  abortable: (key?: string) => void
}

export interface OperationContextWithInternalAPI extends OperationContext {
  getExecuteMap: (op: Operation) => Map<string | undefined, Aborter> | undefined
}
