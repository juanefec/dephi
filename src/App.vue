<template>
  <div id="q-app">
    <router-view :key="$route.fullPath" />
  </div>
</template>
<script>
export default {
  name: 'App',
  mounted() {
    this.$q.dark.set(true)
    this.$checkRegister()
  }
}
</script>