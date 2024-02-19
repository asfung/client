<template>
  <v-treeview :items="treeItems" activatable @update:active="treeViewHandler"></v-treeview>
</template>

<script>
export default {
  data(){
    return{
      selectedNode: null,
      treeItems: [],
      careersParentMap: new Map(), 
    }
  },
  methods: {
    treeViewHandler(item) {
      console.log('Tree node clicked:', item);
      console.log(item[0])
      this.$store.dispatch('Pegawai/TreeFilter/setCareerCode', item[0]);
    },

    transformDataForTreeView(apiResponse) {
  // Create a map to store items based on career_code
  const careerCodeMap = new Map();

  // Iterate over the API response to build the tree structure
  apiResponse.forEach((item) => {
    const { id, career_code, name, tree_lvl } = item;

    if (tree_lvl === '1') {
      // Level 1: Parent nodes
      careerCodeMap.set(career_code, { id, id_tree: id, name, children: [], loaded: false });
    } else if (tree_lvl === '2') {
      // Level 2: Child nodes
      const parentCode = career_code.substring(0, 2); // Assuming the parent code is the first two characters
      const parentNode = careerCodeMap.get(parentCode);

      if (parentNode) {
        const id_tree = id; // Use the id as id_tree for children
        const childNode = { id, id_tree, name, children: [], loaded: false };
        parentNode.children.push(childNode);
      } else {
        // If the parent does not exist, add it as a parent with an empty children array
        careerCodeMap.set(parentCode, { id: parentCode, id_tree: parentCode, name: parentCode, children: [], loaded: false });
      }
    } else if (tree_lvl === '3') {
      // Level 3: Load on demand when expanding Level 2 nodes
      const parentCode = career_code.substring(0, 4); // Assuming the parent code is the first four characters
      const parentNode = careerCodeMap.get(parentCode);

      if (parentNode) {
        const id_tree = id; // Use the id as id_tree for children
        parentNode.children.push({ id, id_tree, name, children: [], loaded: true });
      }
    }
  });

  // Convert the map values to an array to use as treeItems
  const treeItems = Array.from(careerCodeMap.values());

  return treeItems;
},



    async fetchCareerData() {
      try {
        const response = await this.$axios.get('http://localhost:8000/api/careers');
        // Transform the API response for v-treeview
        this.treeItems = this.transformDataForTreeView(response.data);
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