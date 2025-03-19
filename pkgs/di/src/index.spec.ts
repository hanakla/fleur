import { inject } from './index'

describe('inject', () => {
  const proc = inject({
    getText: (): string => 'hello',
  })(({ getText }) => (string: string) => `${getText()} ${string}`)

  it('Should return default implementation value', () => {
    const actual = proc('world')
    expect(actual).toBe('hello world')
  })

  it('Should return mocked value', () => {
    const actual = proc.inject({ getText: () => 'goodbye' }).exec('world')
    expect(actual).toBe('goodbye world')
  })

  it('Should works with HOF', () => {
    const proc = inject({})((_) => (id: string) => (name: string) => ({
      id,
      name,
    }))
    const actual = proc('1')('name')
    expect(actual).toMatchObject({ id: '1', name: 'name' })
  })
})
