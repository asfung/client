<template>
  <v-app>
    <div class="button">
      <v-btn depressed
      color="error"
      @click="$router.push(kemana)"
      >
        UI
      </v-btn>
    </div>
  </v-app>
</template>

<script>
export default {
  layout: 'none',
  props: {
    kemana: {
      // type: any,
      type: String,
      required: true
    },
  },
}
</script>