# 🌼 fleur-di 💉 [![npm version](https://badge.fury.io/js/%40fleur%2Fdi.svg)](https://www.npmjs.com/package/@fleur/di) [![travis](https://travis-ci.org/ra-gg/fleur.svg?branch=master)](https://travis-ci.org/ra-gg/fleur)

Simply DI container without any dependency for TypeScript

## Example

```typescript
import { inject } from '@fleur/di'
import { getUser } from './api'

const fetchUser = inject({ getUser })(
  (injects) => async (userId: string) => {
    await injects.getUser(userId)
  },
)

// Fetch user data
await fetchUser('1')

// Inject mock
const getUserMock = async (userId: string) => ({ id: userId })
await fetchUser.inject({ getUser: getUserMock }).exec('1')

// with redux-thunk
export const fetchUserAction = inject({ getUser })(
  (injects) => (userId: string) => async (dispatch, getState) => {
    const user = await injects.getUser(userId)
    dispatch({ type: 'FETCH_USER_SUCCESS', payload: user })
  },
)

// in tests
dispatch(fetchUserAction.inject({ getUser: getUserMock }).exec('1'))
```
