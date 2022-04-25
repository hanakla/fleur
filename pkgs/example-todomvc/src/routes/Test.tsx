import React from 'react'
import { Link } from '@fleur/route-store-dom'
import RouteStore from '../domain/RouteStore'

export const Test = () => (
  <Link href={RouteStore.makePath('completed')}>completed</Link>
)
