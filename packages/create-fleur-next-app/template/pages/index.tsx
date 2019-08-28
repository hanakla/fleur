import React, { useEffect } from 'react'
import { useStore, useFleurContext } from '@fleur/fleur-react'
import { PageContext } from '@fleur/next'
import { CounterStore } from '../domains/Counter/store'
import { CounterOps } from '../domains/Counter/ops'
import { NextPage } from 'next'

const Index: NextPage = ({}) => {
  const { executeOperation } = useFleurContext()

  const { count } = useStore([CounterStore], getStore => ({
    count: getStore(CounterStore).state.count,
  }))

  useEffect(() => {
    const intervalId = setInterval(() => {
      executeOperation(CounterOps.increment)
    }, 100)

    return () => clearInterval(intervalId)
  }, [])

  return <div>Count: {count}</div>
}

Index.getInitialProps = async (ctx: PageContext) => {
  await ctx.executeOperation(
    CounterOps.asyncIncrement,
    (Math.random() * 1000) | 0,
  )
  return {}
}

export default Index
