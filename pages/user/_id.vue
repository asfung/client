<template>
  <p>this is id: {{ $route.params.id }}</p>
</template>

<script>
export default{
  mounted(){
    console.log(this.$route)
  }
}
</script>