<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/dashboard">Dashboard</router-link> |
      <router-link to="/article">Article</router-link>
    </div>
    <router-view />
  </div>
</template>

<style></style>
