import { MockContextBase } from './MockContextBase'
import { reducerStore } from '@fleur/fleur'
import { mockStore } from './mockStore'

describe('MockContextBase', () => {
  it('Should replace injected dependency', () => {
    const baseContext = new MockContextBase({ stores: [], mocks: new Map() })
    const realFunction = () => 'Hello'
    const mockFunction = () => 'HELL'
    const realObj = { real: true }
    const mockObj = { real: false }

    const derivedContext = baseContext.derive(({ injectDep }) => {
      injectDep(realFunction, mockFunction)
      injectDep(realObj, mockObj)
    })

    expect(baseContext.getDep(realObj)).toMatchObject({ real: true })
    expect(derivedContext.getDep(realObj)).toMatchObject({ real: false })
    expect(baseContext.getDep(realFunction)()).toBe('Hello')
    expect(derivedContext.getDep(realFunction)()).toBe('HELL')
  })

  it('Should patch state to Stores', () => {
    const Store = reducerStore('Store', () => ({ count: 0 }))
    const Store2 = reducerStore('Store2', () => ({ fleur: '🌼' }))

    const baseContext = new MockContextBase({
      stores: [mockStore(Store, {}), mockStore(Store2, {})],
      mocks: new Map(),
    })

    const derivedContext = baseContext.derive(({ deriveStore }) => {
      deriveStore(Store, { count: 1 })
      deriveStore(Store2, { fleur: '🌸' })
    })

    expect(baseContext.getStore(Store).state.count).toBe(0)
    expect(derivedContext.getStore(Store).state.count).toBe(1)
    expect(baseContext.getStore(Store2).state.fleur).toBe('🌼')
    expect(derivedContext.getStore(Store2).state.fleur).toBe('🌸')
  })
})
