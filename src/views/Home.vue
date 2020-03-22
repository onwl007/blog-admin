<template>
  <div class="home">
    <h1>This is home page</h1>
    <router-link to="/about">About</router-link> |
    <router-link to="/dashboard">Dashboard</router-link> |
    <router-link to="/article">Article</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
}
</script>
