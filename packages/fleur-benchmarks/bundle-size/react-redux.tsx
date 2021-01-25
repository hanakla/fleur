import {
  configureStore,
  createAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { render } from 'react-dom'
import { useCallback } from 'react'

const appActions = {
  fetchCount: createAsyncThunk(
    'app/fetchCount',
    async (arg: { userId: number }) => {
      return { count: 1 }
    },
  ),
  increment: createAction<{ amount: number }>('INCREMENT'),
  decrement: createAction<{ amount: number }>('DECREMENT'),
}

const appSlice = createSlice({
  name: 'App',
  initialState: { count: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(appActions.fetchCount.fulfilled, (state, { payload }) => ({
      ...state,
      count: payload.count,
    }))

    builder.addCase(appActions.increment, (state, { payload }) => ({
      ...state,
      count: state.count + payload.amount,
    }))

    builder.addCase(appActions.decrement, (state, { payload }) => ({
      ...state,
      count: state.count - payload.amount,
    }))
  },
})

type RootState = ReturnType<typeof store.getState>
const store = configureStore({ reducer: { app: appSlice.reducer } })

;(async () => {
  await store.dispatch(appActions.fetchCount({ userId: 1 }))
  store.dispatch(appActions.increment({ amount: 10 }))

  console.log("It's Redux")
  console.log('Assert', store.getState().app.count === 11)
})()

const App = () => {
  const dispatch = useDispatch()
  const count = useSelector((state: RootState) => state.app.count)
  const handleClick = useCallback(() => {
    dispatch(appActions.increment({ amount: 1 }))
  }, [])

  return <button onClick={handleClick}>{count}</button>
}

document.addEventListener('DOMContentLoaded', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'),
  )
})
