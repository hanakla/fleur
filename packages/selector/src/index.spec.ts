import selector from './index'

describe('selector', () => {
  it('Should select user', () => {
    const rootState = {
      users: {
        '1': { name: 'Hello 太郎' },
      },
    }

    const selectUsers = selector((state: typeof rootState) => state.users)
    const selectUser = selector(
      (state: typeof rootState, userId: string) => selectUsers(state)[userId],
    )
    expect(selectUser(rootState, '1')).toMatchObject({ name: 'Hello 太郎' })
  })
})
