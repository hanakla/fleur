import Fleur, { action, ComponentContext, listen, operation, Store } from '@ragg/fleur'
import * as React from 'react'
import { mount } from 'enzyme'

import connectToStores from './connectToStores'
import { createElementWithContext } from './createElementWithContext'

describe('connectToStores', () => {
    // Action Identifier
    const ident = action<{ increase: number }>()

    // Operation
    const op = operation((context) => { context.dispatch(ident, { increase: 10 }) })

    // Store
    const TestStore = class extends Store<{ count: number }> {
        public static storeName = 'TestStore'

        public state = { count: 10 }

        get count() { return this.state.count }

        private increase = listen(ident, (payload) => {
            this.updateWith(d => d.count += payload.increase)
        })
    }

    // Component
    const Component = connectToStores([TestStore], (context: ComponentContext, ) => ({
        count: context.getStore(TestStore).count
    }))(class Component extends React.Component<{ count: number, anotherProp: string }> {
        public render() {
            return null
        }
    })

    // App
    const app = new Fleur({ stores: [TestStore] })


    it('Should passed non connected props', () => {
        const context = app.createContext()
        const wrapper = mount(createElementWithContext(context, Component, { anotherProp: 'anotherProp' }))

        expect(wrapper.find('Component').props()).toEqual(
            expect.objectContaining({
                anotherProp: 'anotherProp'
            })
        )

        wrapper.unmount()
    })

    it('Should map stores to props', async () => {
        const context = app.createContext()
        const wrapper = mount(createElementWithContext(context, Component))

        expect(wrapper.find('Component').props()).toEqual({ count: 10 })

        await context.executeOperation(op, {})
        wrapper.update()
        expect(wrapper.find('Component').props()).toEqual({ count: 20 })
        wrapper.unmount()
    })

    it('Should unlisten on component unmounted', () => {
        const context = app.createContext()
        const wrapper = mount(createElementWithContext(context, Component))

        expect(context.getStore(TestStore).listeners['onChange']).toHaveLength(1)
        wrapper.unmount()
        expect(context.getStore(TestStore).listeners['onChange']).toHaveLength(0)
    })
})
