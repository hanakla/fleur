import { action, actions, ActionsOf } from './Action'

describe('Action', () => {
  it('Should named action', () => {
    const a = action('increment')
    expect(a.name).toBe('increment')
  })

  it('Should named action with object', () => {
    const a = actions('Counter', {
      increment: action<{ increase: number }>(),
      decrement: action<{ decrease: number }>(),
    })
    expect(a.increment.name).toBe('Counter/increment')
    expect(a.decrement.name).toBe('Counter/decrement')
  })

  it('Should expose async actions', () => {
    const a = actions('Async', {
      fetch: action.async<{}, {}, {}>(),
    })

    expect(a.fetch.started.name).toBe('Async/fetch.started')
    expect(a.fetch.done.name).toBe('Async/fetch.done')
    expect(a.fetch.failed.name).toBe('Async/fetch.failed')
  })

  it('ActionsOf use case', () => {
    const a = actions('Counter', {
      increment: action<{ increase: number }>(),
      decrement: action<{ decrease: number }>(),
    })

    const b = actions('Todo', {
      add: action<{ description: string }>(),
    })

    type AppActions = ActionsOf<typeof a> | ActionsOf<typeof b>
  })
})
