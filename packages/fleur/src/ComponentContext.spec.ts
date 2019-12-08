import { Fleur } from './Fleur'
import { operation } from './Operations'
import { ComponentContext } from './ComponentContext'
import { OperationContext } from './OperationContext'
import { AppContext } from './AppContext'

describe('ComponentContext', () => {
  let context: AppContext
  let componentContext: ComponentContext

  beforeEach(() => {
    const app = new Fleur()
    context = app.createContext()
    componentContext = context.componentContext
  })

  it('#executeOperation should receive arguments', () => {
    const spy = jest.fn()
    componentContext.executeOperation(spy, 'a', 'b')
    expect(spy).toBeCalledWith(context.operationContext, 'a', 'b')
  })

  it('#executeOperation should not return value', () => {
    const op = operation(() => {})
    const returns = componentContext.executeOperation(op)
    expect(returns).toBe(undefined)
  })
})
