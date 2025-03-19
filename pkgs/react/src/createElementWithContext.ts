import { AppContext } from '@fleur/fleur'
import * as React from 'react'

import { FleurContext } from './ComponentReactContext'

const createElementWithContext = <P>(
  context: AppContext,
  Component: React.ComponentType<P>,
  props?: P,
): React.ReactElement =>
  React.createElement(FleurContext, {
    value: context,
    children: React.createElement(Component, props || ({} as any)),
  })

export { createElementWithContext }
