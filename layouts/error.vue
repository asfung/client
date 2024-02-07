<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">Page Not Found</h1>
    <h1 v-else>an error occured</h1>
    <NuxtLink to="/">Home Page</NuxtLink>
  </div>
</template>

<script>
  export default {
    props: ['error'],
    layout: 'blog'
  }
</script>