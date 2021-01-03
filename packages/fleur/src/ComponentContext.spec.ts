import { Fleur } from './Fleur'
import { operation, OperationType } from './Operations'
import { ComponentContext } from './ComponentContext'
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
    componentContext.executeOperation(
      (spy as unknown) as OperationType,
      'a',
      'b',
    )

    const call = spy.mock.calls[0]
    expect(call[0].executeOperation).toBe(context.executeOperation)
    expect(call[0].getStore).toBe(context.getStore)
    expect(call[1]).toBe('a')
    expect(call[2]).toBe('b')
  })

  it('#executeOperation should not return value', () => {
    const op = operation(() => {})
    const returns = componentContext.executeOperation(op)
    expect(returns).toBe(undefined)
  })
})
