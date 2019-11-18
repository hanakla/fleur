<template>
  <div>
    Current count: {{ count }}
    <button @click="handleClick">Increase</button>
  </div>
</template>

<script>
import { refStore } from '../../dist/index'
import { CountStore } from './CountStore'
import { CounterOps } from './CounterOps'

export default {
  name: 'App',
  computed: {
    count: refStore(store => store(CountStore).state.count),
  },
  methods: {
    handleClick() {
      this.$executeOperation(CounterOps.increase)
    },
  },
}
</script>
