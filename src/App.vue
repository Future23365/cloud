<template>
  <div id="app">
    <Header></Header>
    <div>
      <router-view></router-view>
    </div>
  </div>
  
</template>

<script>
import Header from './components/Header.vue'
export default {
  name: 'app',
  components: {
    Header
  }
}
</script>

<style scoped>

</style>