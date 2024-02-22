<template>
  <div>
    <v-row>
      <v-col class="pa-6">
        <h1>Posisi Kerja</h1>
      </v-col>
      <v-col class="d-flex align-end flex-column pa-6">
        <v-btn @click="openDialog" color="primary">Tambah</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="">
        <v-treeview :items="treeDataItems" activatable @update:active="treeViewHandler" ></v-treeview>
      </v-col>
    </v-row>

    <v-dialog v-model="newPosisiDialog" max-width="600px">
        <v-card>
          <v-card-title>Posisi Baru</v-card-title>
          <v-card-text>
            <v-text-field v-model="namePosisi" label="Nama" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="addNewPosisi" color="primary">Save</v-btn>
            <v-btn @click="closeNewPosisiDialog" color="error">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </div>


</template>

<script>
export default {
  middleware: ['auth'],
  data(){
    return{
      treeDataItems: [],
      clickedValue: 0,
      newPosisiDialog: false,
      namePosisi: '',
    }
  },

  methods: {

    treeViewHandler(item) {
      this.clickedValue = item[0]
      // console.log(this.clickedValue)
      console.log(item)
      console.log(this.clickedValue)
      if(this.clickedValue === undefined){
        this.clickedValue = null
        console.log(this.clickedValue)
      }
    },

    async fetchCareerData() {
      try {
        const response = await this.$axios.get('http://localhost:8000/api/career_test');
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

      openDialog(){
        this.newPosisiDialog = true
      },
      closeNewPosisiDialog(){
        this.newPosisiDialog = false
      },

      async addNewPosisi(){
        try{
          await this.$store.dispatch('Pegawai/Posisi/addPosisi', {name: this.namePosisi, id: this.clickedValue})
        }catch(err){
          console.log(err)
        }
        // console.log(this.clickedValue)
      }


    },

    mounted(){
      this.fetchCareerData()
    },
  }
</script>