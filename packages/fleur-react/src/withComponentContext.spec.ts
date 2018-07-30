import Fleur from '@ragg/fleur'
import { mount } from 'enzyme'
import * as React from 'react'

import { createElementWithContext } from './createElementWithContext'
import withComponentContext, { ContextProp } from './withComponentContext'

describe('withComponentContext', () => {
    it('Is received context in props', async () => {
        const app = new Fleur()
        const context = app.createContext()
        const Component = withComponentContext(class extends React.Component<ContextProp> {
            public render() {
                return React.createElement('div')
            }
        })

        const wrapper = mount(createElementWithContext(context, Component, { prop: 'prop string' }))

        // TODO: Wait for React 16 suppors in Enzyme
        expect(wrapper.find('Component').props()).toEqual({
            context: {
                executeOperation: context.componentContext.executeOperation,
                getStore: context.componentContext.getStore,
            },
            prop: 'prop string'
        })
    })
})
