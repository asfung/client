<template>
  <v-treeview return-object :items="treeDataItems" activatable @update:active="treeViewHandler"></v-treeview>
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
      if(item[0] == null){
        item[0] = []
      }
      console.log(item[0])
      this.$store.dispatch('Pegawai/setSelectedId', item[0]);
    },

    async fetchCareerData() {
      try {
        // const response = await this.$axios.get('http://localhost:8000/api/careers');
        // // Transform the API response for v-treeview
        // this.treeItems = this.transformDataForTreeView(response.data);
        const response = await this.$axios.get('http://localhost:8000/api/career_test');
        // this.treeDataItems = response.data
        this.treeDataItems = this.transformDataForTreeView(response.data);

      } catch (error) {
        console.error('Error fetching career data:', error);
      }

    },
    transformDataForTreeView(data) {
      return data.map(item => {
        const transformedItem = {
          id: item.id_tree,
          parent_id: item.parent_id,
          name: item.name,
          id_default: item.id,
          tree_lvl: item.tree_lvl,
          children: item.children,
        };

        if (item.children && item.children.length > 0) {
          transformedItem.children = this.transformDataForTreeView(item.children);
        }

        return transformedItem;
      });
    },

  },

  mounted(){
    this.fetchCareerData();
  },

  computed: {
    selectedId() {
      return this.$store.getters['Pegawai/getSelectedId'];
    },
  },
}
</script>
