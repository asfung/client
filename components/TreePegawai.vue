<template>
  <v-treeview :items="treeDataItems" activatable @update:active="treeViewHandler"></v-treeview>
</template>

<script>
export default {
  data(){
    return{
      selectedNode: null,
      treeItems: [],
      treeDataItems: [],
      careersParentMap: new Map(), 
    }
  },
  methods: {
    treeViewHandler(item) {
      console.log('node clicked:', item);
      console.log(item[0], 'from TreePegawai')
      this.$store.dispatch('Pegawai/TreeFilter/setCareerCode', item[0]);
    },

    async fetchCareerData() {
      try {
        // const response = await this.$axios.get('http://localhost:8000/api/careers');
        // // Transform the API response for v-treeview
        // this.treeItems = this.transformDataForTreeView(response.data);
        const response = await this.$axios.get('http://localhost:8000/api/career_test');
        this.treeDataItems = response.data

      } catch (error) {
        console.error('Error fetching career data:', error);
      }
    },

   
  },

  mounted(){
    this.fetchCareerData();
  },

  computed: {
    selectedCareerCode() {
      return this.$store.getters['Pegawai/TreeFilter/selectedCareerCode'];
    },
  },
}
</script>