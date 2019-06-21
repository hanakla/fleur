import { Fleur } from './Fleur'
import { OperationContext } from './OperationContext'
import { operation } from './Operations'

describe('OperationContext', () => {
  let context: OperationContext

  beforeEach(() => {
    const app = new Fleur({ stores: {} })
    context = app.createContext().operationContext
  })

  it('#executeOperation should receive arguments', () => {
    const spy = jest.fn()
    context.executeOperation(spy, 'a', 'b')
    expect(spy).toBeCalledWith(context, 'a', 'b')
  })

  it('#executeOperation should returns Promise', () => {
    const op = operation(() => {})
    const returns = context.executeOperation(op)
    expect(returns).toBeInstanceOf(Promise)
  })
})
