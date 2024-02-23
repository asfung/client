<template>
  <div>
    <v-row style="background-color: #2E7D32;">
      <v-col class="pa-6">
        <h1>Posisi Kerja</h1>
      </v-col>
      <v-col class="d-flex align-end flex-column pa-6">
        <v-btn @click="openDialog" color="primary">Tambah</v-btn>
        <v-btn v-if="clickedValue !== null" @click="openEditDialog" color="secondary">edit</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-treeview :items="treeDataItems" activatable @update:active="treeViewHandler"></v-treeview>
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

      <v-dialog v-model="editPosisiDialog" max-width="600px">
        <v-card>
          <v-card-title>Edit Posisi</v-card-title>
          <v-card-text>
            <v-text-field v-model="editPosisi" label="Nama" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="editNewPosisi" color="primary">Save</v-btn>
            <v-btn @click="closeEditPosisiDialog" color="secondary">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="closeDeleteDialog" color="error">HAPUS</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="hapusDialog" max-width="600px">
        <v-card>
          <v-card-title>Edit Posisi</v-card-title>
          <v-card-text>
            <p style="font-weight: bold; color: red;">PEGAWAI KERJA AKAN TERHAPUS JIKA MEMILIKI POSISI INI, ANDA YAKIN?</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="deletePosisi" color="primary">IYA</v-btn>
            <v-btn @click="closeNewPosisiDialog" color="secondary">JANGAN</v-btn>
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
      // treeviewKey: 0,
      hapusDialog: false,
      editPosisiDialog: false,
      editPosisi: '',
      treeDataItems: [],
      clickedValue: null,
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
        console.log(this.clickedValue)
        console.log(this.namePosisi)
      },
      closeNewPosisiDialog(){
        this.newPosisiDialog = false
        this.hapusDialog = false
        this.namePosisi = ''
      },
      openEditDialog(){
        // this.editPosisiDialog = true
        if (this.clickedValue !== null) {
          const selectedItem = this.findItemById(this.treeDataItems, this.clickedValue);
          this.editPosisi = selectedItem ? selectedItem.name : '';
        }

        this.editPosisiDialog = true;
      },
      closeEditPosisiDialog(){
        this.editPosisiDialog = false
        this.editPosisi = ''
      },

      closeDeleteDialog(){
        this.hapusDialog = true
      },


      async addNewPosisi(){
        try{
          await this.$store.dispatch('Pegawai/Posisi/addPosisi', {name: this.namePosisi, id: this.clickedValue})
          this.closeNewPosisiDialog()
          this.fetchCareerData()
        }catch(err){
          console.log(err)
        }
        // console.log(this.clickedValue)
      },

      async editNewPosisi(){
        await this.$store.dispatch('Pegawai/Posisi/editPosisi', {name: this.editPosisi, id: this.clickedValue})
        this.closeEditPosisiDialog()
        this.fetchCareerData()
      },

      deletePosisi(){
        console.log('hapus')
      },


      // sementara
      findItemById(items, id) {
        for (const item of items) {
          if (item.id === id) {
            return item;
          }

          if (item.children && item.children.length > 0) {
            const foundInChildren = this.findItemById(item.children, id);
            if (foundInChildren) {
              return foundInChildren;
            }
          }
        }

        return null;
      },

    },

    mounted(){
      this.fetchCareerData()
    },
  }
</script>