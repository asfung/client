<template>
  <div style="margin: auto;">
    <!-- {{ dataId }} -->
    <v-card
    class="mx-auto"
    color="#26c6da"
    dark
    max-width="400"
    v-if="dataId.author !== undefined"
  >
    <v-card-title>
      <span class="text-h6 font-weight-light">Quote Cuy</span>
    </v-card-title>

    <v-card-text class="text-h5 font-weight-bold">
      {{ `"${dataId.quote}"` }}
    </v-card-text>

    <v-card-actions>
      <v-list-item class="grow">
        <v-list-item-avatar color="grey darken-3">
          <v-img
            class="elevation-6"
            alt=""
            src="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ dataId.author }}</v-list-item-title>
        </v-list-item-content>

        
      </v-list-item>
    </v-card-actions>
  </v-card>

  <v-card v-if="dataId.author === undefined">
    {{ dataId }}
  </v-card>

  </div>
</template>

<script>
export default {
  layout: 'none',
  data(){
    return {
      dataId: [],
    }
  },
  methods: {
    async fetchData(){
      try{
        const response = await fetch(`http://localhost:8000/api/v1/quotes/${this.$route.params.id}`)
        const resToJson = await response.json()
        this.dataId = resToJson
        console.log(this.dataId)
      }catch(err){
        console.log('error fetching data')
      }
    }
  },

  mounted() {
    this.fetchData()
    // console.log(this.$route.params)
  }

}

</script>