<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-text-field v-model="search" label="Search" @input="filterItems" />
        </v-col>
        <v-col class="text-right">
          <v-btn @click="openNewItemDialog" color="primary">Tambah Pegawai</v-btn>
        </v-col>
      </v-row>

      <v-data-table :headers="headers" :items="filteredItems" item-key="id">
        <template v-slot:item="props">
          <tr>
            <td>{{ props.item.id }}</td>
            <td>{{ props.item.nama }}</td>
            <td>{{ props.item.jenis_kelamin }}</td>
            <td>{{ props.item.kota }}</td>
            <td>{{ props.item.agama }}</td>
            <td>{{ props.item.posisi }}</td>
            <td>{{ props.item.gaji }}</td>
            <td>
              <v-btn @click="openEditItemDialog(props.item)" icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn @click="confirmDelete(props.item.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <!-- <v-btn @click="deletePegawai(props.item.id)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn> -->
            </td>
          </tr>
        </template>
      </v-data-table>

      <!-- New Item Dialog POP UP -->
      <v-dialog v-model="newItemDialog" max-width="600px">
        <v-card>
          <v-card-title>New Item</v-card-title>
          <v-card-text>
            <!-- <v-text-field v-model="newItem.id" label="No"></v-text-field> -->
            <v-text-field v-model="newItem.nama" label="Nama" required></v-text-field>
            <!-- <v-text-field v-model="newItem.jenis_kelamin" label="Jenis Kelamin"></v-text-field> -->
            <v-select v-model="newItem.jenis_kelamin" :items="genderOptions" label="Jenis Kelamin"></v-select>
            <v-text-field v-model="newItem.kota" label="Kota"></v-text-field>
            <v-text-field v-model="newItem.agama" label="Agama"></v-text-field>
            <v-text-field v-model="newItem.posisi" label="Posisi Kerja"></v-text-field>
            <v-text-field v-model="newItem.gaji" label="Salary" type="number"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="addPegawai" color="primary">Save</v-btn>
            <v-btn @click="closeNewItemDialog" color="error">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Edit Item Dialog POP UP -->
      <v-dialog v-model="editItemDialog" max-width="600px">
        <v-card>
          <v-card-title>Edit Item</v-card-title>
          <v-card-text>
            <v-text-field v-model="editedItem.id" label="No" readonly></v-text-field>
            <v-text-field v-model="editedItem.nama" label="Nama"></v-text-field>
            <!-- <v-text-field v-model="editedItem.jenis_kelamin" label="Jenis Kelamin"></v-text-field> -->
            <v-select v-model="editedItem.jenis_kelamin" :items="genderOptions" label="Jenis Kelamin"></v-select>
            <v-text-field v-model="editedItem.kota" label="Kota"></v-text-field>
            <v-text-field v-model="editedItem.agama" label="Agama"></v-text-field>
            <v-text-field v-model="editedItem.posisi" label="Posisi Kerja"></v-text-field>
            <v-text-field v-model="editedItem.gaji" label="Salary" type="number"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <!-- <v-btn @click="saveEditedItem" color="primary">Save</v-btn> -->
            <v-btn @click="addPegawai" color="primary">Save</v-btn>
            <v-btn @click="closeEditItemDialog" color="error">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- konfirmasi -->
      <v-dialog v-model="deleteConfirmationDialog" max-width="400">
        <v-card>
          <v-card-title>r u sure?</v-card-title>
          <v-card-actions>
            <!-- <v-btn @click="deleteItemConfirmed" color="error">Yes</v-btn> -->
            <v-btn @click="deletePegawai" color="error">Yes</v-btn>
            <v-btn @click="cancelDelete" color="primary">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-container>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  layout: 'none',
  data() {
    return {
      deleteConfirmationDialog: false,
      itemToDeleteId: null,
      genderOptions: ['Laki-Laki', 'Perempuan'],
      items: [],
      headers: [
        { text: "No", value: "id" },
        { text: "Nama", value: "nama" },
        { text: "Jenis Kelamin", value: "jenis_kelamin" },
        { text: "Kota", value: "kota" },
        { text: "Agama", value: "agama" },
        { text: "Posisi Kerja", value: "posisi" },
        { text: "gaji", value: "salary" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      search: "",
      newItemDialog: false,
      editItemDialog: false,
      newItem: {
        id: "",
        nama: "",
        jenis_kelamin: "",
        kota: "",
        agama: "",
        posisi: "",
        gaji: "",
      },
      editedItem: {
        id: 0,
        nama: "",
        jenis_kelamin: "",
        kota: "",
        agama: "",
        posisi: "",
        gaji: "",
      },
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter((item) =>
        item.nama.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    openNewItemDialog() {
      this.newItemDialog = true;
    },
    closeNewItemDialog() {
      this.newItemDialog = false;
      // clearing the form of new item after save new item
      this.newItem = { id: "", nama: "", jenis_kelamin: "", kota: "", agama: "", posisi: "", gaji: "" };
    },
    saveNewItem() {
      const nextId = this.items.length > 0 ? this.items[this.items.length - 1].id + 1 : 1;
      this.items.push({
        // id: this.newItem.id,
        id: nextId,
        nama: this.newItem.nama,
        jenis_kelamin: this.newItem.jenis_kelamin,
        kota: this.newItem.kota,
        agama: this.newItem.agama,
        posisi: this.newItem.posisi,
        gaji: this.newItem.gaji,
      });
      this.closeNewItemDialog();
    },
    openEditItemDialog(item) {
      this.editedItem = { ...item };
      this.editItemDialog = true;
    },
    closeEditItemDialog() {
      this.editItemDialog = false;
    },
    saveEditedItem() {
      const index = this.items.findIndex((item) => item.id === this.editedItem.id);
      this.$set(this.items, index, { ...this.editedItem });
      this.closeEditItemDialog();
    },
    confirmDelete(itemId) {
      this.itemToDeleteId = itemId;
      this.deleteConfirmationDialog = true;
    },

    deleteItemConfirmed() {
      if (this.itemToDeleteId) {
        const index = this.items.findIndex((item) => item.id === this.itemToDeleteId);
        if (index !== -1) {
          this.items.splice(index, 1);
        }
        this.cancelDelete();
      }
    },

    cancelDelete() {
      this.deleteConfirmationDialog = false;
      this.itemToDeleteId = null;
    },


    // kita gunakan api nya kaka
    async findAll(){
      try{
        const pegawais = await axios.get('http://localhost:8000/api/v1/pegawai')
        this.items = pegawais.data 
      }catch(err){
        console.log(err)
      }
    },
    async addPegawai(){
      try{
        const pegawaiTambah = await axios.post('http://localhost:8000/api/v1/pegawai', {
          nama: this.newItem.nama,
          jenis_kelamin: this.newItem.jenis_kelamin,
          kota: this.newItem.kota,
          agama: this.newItem.agama,
          posisi: this.newItem.posisi,
          gaji: this.newItem.gaji,
        })
        console.log(pegawaiTambah.data)
        this.closeNewItemDialog();
      }catch(err){
        console.log('gk berhasil ')
        console.log(err)
      }
    },

    async deletePegawai(){
      try{
        const response = await axios.delete(`http://localhost:8000/api/v1/pegawai/${this.itemToDeleteId}`);
      if (response.status === 200) {
        console.log('terhapus..');
        const index = this.items.findIndex((item) => item.id === this.itemToDeleteId);
        if (index !== -1) {
          this.items.splice(index, 1);
        }
        this.cancelDelete();
      } else {
        console.error('Failed to delete pegawai');
      }
      }catch(err){
        console.log('gk bisa dihapus kocakk')
        console.info(err)
      }
    },

    filterItems() {

    },
  },
  mounted(){
    this.findAll()
    // this.addPegawai()
    // this.deletePegawai()
  }
};
</script>
