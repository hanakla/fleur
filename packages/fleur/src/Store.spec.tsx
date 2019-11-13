import { reducerStore } from './Store'
import { Fleur } from './Fleur'
import { action } from './Action'

describe('Store', () => {
  const increase = action()
  const TestStore = reducerStore('TestStore', () => ({ count: 0 })).listen(
    increase,
    draft => draft.count++,
  )
  const app = new Fleur({ stores: [TestStore] })

  it('Should listen / unlisten change event', async () => {
    const context = app.createContext()
    const spy = jest.fn()
    const store = context.getStore(TestStore)

    store.on(spy)
    context.dispatch(increase, {})
    await new Promise(r => requestAnimationFrame(r))
    expect(spy).toBeCalled()

    store.off(spy)
    context.dispatch(increase, {})
    await new Promise(r => requestAnimationFrame(r))
    expect(spy).toBeCalledTimes(1)
  })
})
