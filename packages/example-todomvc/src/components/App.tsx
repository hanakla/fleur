import React from 'react'
import { useRouter } from '@ragg/fleur-route-store-dom'

export const App = () => {
  const { route } = useRouter()

  return <div>{route && route.handler && <route.handler />}</div>
}
