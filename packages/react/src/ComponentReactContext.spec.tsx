import Fleur, { AppContext, operation } from '@fleur/fleur'
import { renderHook } from '@testing-library/react-hooks'
import React, { ComponentType } from 'react'
import { FleurContext } from './ComponentReactContext'
import { useFleurContext } from './useFleurContext'

describe('ComponentContext', () => {
  let context: AppContext

  const wrapContext = (context: AppContext): ComponentType => ({
    children,
  }) => <FleurContext value={context}>{children}</FleurContext>

  beforeEach(() => {
    const app = new Fleur()
    context = app.createContext()
  })

  it('#executeOperation should receive arguments', () => {
    const { result } = renderHook(useFleurContext, {
      wrapper: wrapContext(context),
    })

    const appSpy = jest.spyOn(context, 'executeOperation')
    const opSpy = jest.fn()
    const op = operation(opSpy)

    result.current.executeOperation(op, 'a', 'b')

    expect(opSpy).toBeCalledWith(expect.anything(), 'a', 'b')
    expect(appSpy).toBeCalledWith(op, 'a', 'b')
  })

  it('#executeOperation should not return value', () => {
    const { result } = renderHook(useFleurContext, {
      wrapper: wrapContext(context),
    })

    const op = operation(async () => {})
    const returns = result.current.executeOperation(op)
    expect(returns).toBe(undefined)
  })
})
