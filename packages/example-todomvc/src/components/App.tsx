import React from 'react'
import { useRoute } from '@fleur/route-store-dom'

export const App = () => {
  const { route } = useRoute()

  return <div>{route && route.handler && <route.handler />}</div>
}
