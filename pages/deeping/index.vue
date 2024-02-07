<template>
  <div>
    <!-- {{ data }} -->
      <v-data-table :headers="headers" :items="data" item-key="id">
        <template v-slot:items="{ item_data }">
          <tr>
            <td>{{  }}</td>
            <td>{{ item_data.id }}</td>
            <td>{{ item_data.author }}</td>
            <td>{{ item_data.quote }}</td>
          </tr>
        </template>
      </v-data-table>
  </div>
</template>

<script>
export default {
  layout: 'none',
  data(){
    return {
      data: [],
      headers: [
        { text: "id", value: "id" },
        { text: "Author", value: "author" },
        { text: "Quote", value: "quote" },
      ],
    }
  },

  methods: {
    async fetchData(){
    try{
      const response = await fetch('http://localhost:8000/api/v1/quotes')
      const resToJson = await response.json()
      this.data = resToJson
      console.log(this.data)
    }catch(err){
      console.log('error fetching data')
    }

    },
  },

  mounted(){
    this.fetchData() 
  }

}
</script>