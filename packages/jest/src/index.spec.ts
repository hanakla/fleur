import './index'

describe('index', () => {
  it('accessible from expect', () => {
    expect(expect('').toDispatchAction).toBeInstanceOf(Function)
    expect(expect('').toExecuteOperation).toBeInstanceOf(Function)
  })
})
