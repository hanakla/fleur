import Fleur from './Fleur'
import OperationContext from './OperationContext'
import { operation } from './Operations'

describe('OperationContext', () => {
  let context: OperationContext

  beforeEach(() => {
    const app = new Fleur()
    context = app.createContext().operationContext
  })

  it('#executeOperation should returns Promise', () => {
    const op = operation(async (context, a: string, b: string) => {})
    const returns = context.executeOperation(op, 'a', 'b')
    expect(returns).toBeInstanceOf(Promise)
  })
})
