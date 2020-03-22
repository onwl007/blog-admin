<template>
  <component :is="layoutComponent"></component>
</template>

<script>
import Default from './components/layouts/Default'
import Empty from './components/layouts/Empty'
const names = ['default', 'empty']
const prefix = 'Layout'

export default {
  name: 'App',
  components: {
    Default,
    Empty,
  },
  computed: {
    layoutComponent() {
      let appLayout = this.$store.getters['app/layout']
      if (!names.includes(appLayout)) {
        appLayout = 'default'
      }
      return appLayout
    },
  },
}
</script>

<style></style>
