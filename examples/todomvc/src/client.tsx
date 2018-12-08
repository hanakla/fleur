import ReactDOM from 'react-dom'
import { App } from './components/App'
import { app } from './app'
import { createElementWithContext } from '@ragg/fleur-react'

document.addEventListener('DOMContentLoaded', () => {
  const state = (window as any).__rehydratedState
  const context = app.createContext()
  context.rehydrate(state)

  const element = createElementWithContext(context, App)
  ReactDOM.hydrate(element, document.querySelector('.todoapp'))
})
