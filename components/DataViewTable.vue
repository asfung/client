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
            <td>
              <img :src="`http://localhost:8000/storage/${props.item.file}`" alt="gambar" style="max-width: 50px; max-height: 50px;">
            </td>
            <td>{{ props.item.nama }}</td>
            <td>{{ props.item.jenis_kelamin }}</td>
            <td>{{ props.item.provinsi }}</td>
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
            <!-- <p>{{ this.selectedProvince }}</p> -->
            <!-- <p>{{ this.provinceOptions }}</p> -->
            <v-file-input v-model="newItem.file" label="Upload Image" accept="image/*"></v-file-input>
            <v-text-field v-model="newItem.nama" label="Nama" required></v-text-field>
            <!-- <v-text-field v-model="newItem.jenis_kelamin" label="Jenis Kelamin"></v-text-field> -->
            <v-select v-model="newItem.jenis_kelamin" :items="genderOptions" label="Jenis Kelamin"></v-select>
            <v-autocomplete
              v-model="newItem.provinsi"
              :items="provinceOptions"
              item-text="name"
              item-value="name"
              label="Pilih Provinsi"
              outlined
              dense
            ></v-autocomplete>
            <!-- <v-text-field v-model="newItem.provinsi" label="provinsi"></v-text-field> -->
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
            <p>{{ editedItem.file }}</p>
            <v-file-input v-model="editedItem.file" label="Upload Image" accept="image/*"></v-file-input>
            <v-text-field v-model="editedItem.nama" label="Nama"></v-text-field>
            <!-- <v-text-field v-model="editedItem.jenis_kelamin" label="Jenis Kelamin"></v-text-field> -->
            <v-select v-model="editedItem.jenis_kelamin" :items="genderOptions" label="Jenis Kelamin"></v-select>
            <!-- <v-text-field v-model="editedItem.provinsi" label="provinsi"></v-text-field> -->
            <p>{{ editedItem.provinsi }}</p>
            <v-autocomplete
              v-model="editedItem.provinsi"
              :items="provinceOptions"
              item-text="name"
              item-value="name"
              label="Pilih Provinsi"
              outlined
              dense
            ></v-autocomplete>
            <v-text-field v-model="editedItem.agama" label="Agama"></v-text-field>
            <v-text-field v-model="editedItem.posisi" label="Posisi Kerja"></v-text-field>
            <v-text-field v-model="editedItem.gaji" label="Salary" type="number"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <!-- <v-btn @click="saveEditedItem" color="primary">Save</v-btn> -->
            <v-btn @click="editById" color="primary">Save</v-btn>
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
      provinceOptions: [],
      deleteConfirmationDialog: false,
      itemToDeleteId: null,
      genderOptions: ['Laki-Laki', 'Perempuan'],
      items: [],
      headers: [
        { text: "No", value: "id" },
        { text: "Image", value: "file"},
        { text: "Nama", value: "nama" },
        { text: "Jenis Kelamin", value: "jenis_kelamin" },
        { text: "Provinsi", value: "provinsi" },
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
        provinsi: "",
        agama: "",
        posisi: "",
        gaji: "",
        file: [],
      },
      editedItem: {
        id: 0,
        nama: "",
        jenis_kelamin: "",
        provinsi: "",
        agama: "",
        posisi: "",
        gaji: "",
        file: [],
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
      this.newItem = { id: "", file: "", nama: "", jenis_kelamin: "", provinsi: "", agama: "", posisi: "", gaji: "" };
    },
    saveNewItem() {
      const nextId = this.items.length > 0 ? this.items[this.items.length - 1].id + 1 : 1;
      this.items.push({
        // id: this.newItem.id,
        id: nextId,
        file: this.newItem.file,
        nama: this.newItem.nama,
        jenis_kelamin: this.newItem.jenis_kelamin,
        provinsi: this.newItem.provinsi,
        agama: this.newItem.agama,
        posisi: this.newItem.posisi,
        gaji: this.newItem.gaji,
      });
      this.closeNewItemDialog();
    },
    openEditItemDialog(item) {
      this.editedItem = { ...item };

      // this.editedItem = JSON.parse(JSON.stringify(item));
      // console.log(this.editedItem.file)
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
        const token = localStorage.getItem('token')
        const pegawais = await axios.get('http://localhost:8000/api/v1/pegawai', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        this.items = pegawais.data 
      }catch(err){
        console.log(err)
        localStorage.removeItem('token')
        console.log('harap login ulang')
        window.location.href = "/login"
      }
    },
    
    async addPegawai(){
      try{
        const token = localStorage.getItem('token')
        const formData = new FormData()
      
        formData.append('file', this.newItem.file);
        formData.append('nama', this.newItem.nama);
        formData.append('jenis_kelamin', this.newItem.jenis_kelamin);
        formData.append('provinsi', this.newItem.provinsi);
        // formData.append('provinsiId', this.newItem.provinsi.id);
        formData.append('agama', this.newItem.agama);
        formData.append('posisi', this.newItem.posisi);
        formData.append('gaji', this.newItem.gaji);
        const pegawaiTambah = await axios.post('http://localhost:8000/api/v1/pegawai', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        })
        console.log(pegawaiTambah.data)
        // console.log(this.newItem.file)
        this.closeNewItemDialog();
        this.findAll() // walaaahhh
      }catch(err){
        console.log('gk berhasil ')
        console.log(err)
      }
    },

    async deletePegawai(){
      try{
        const token = localStorage.getItem('token')
        const response = await axios.delete(`http://localhost:8000/api/v1/pegawai/${this.itemToDeleteId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data',
          }
        });
      if (response.status === 200) {
        console.log('terhapus..');
        const index = this.items.findIndex((item) => item.id === this.itemToDeleteId);
        if (index !== -1) {
          this.items.splice(index, 1);
        }
        this.cancelDelete();
      } else {
        console.error('gagal delete');
      }
      }catch(err){
        // console.log('gk bisa dihapus kocakk')
        console.info(err)
      }
    },

    async editById(){
      try{
        const formData = new FormData()
        // https://stackoverflow.com/questions/74471540/multipart-form-data-not-working-on-axios-put-request 
        formData.append('_method', 'put');

        formData.append('file', this.editedItem.file);
        formData.append('nama', this.editedItem.nama);
        formData.append('jenis_kelamin', this.editedItem.jenis_kelamin);
        formData.append('provinsi', this.editedItem.provinsi);
        formData.append('agama', this.editedItem.agama);
        formData.append('posisi', this.editedItem.posisi);
        formData.append('gaji', this.editedItem.gaji);

        const token = localStorage.getItem('token');
        const response = await axios.post(`http://localhost:8000/api/v1/pegawai/${this.editedItem.id}`, formData ,{
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          }
        });

        console.log(this.editedItem.file)
        // edit pada editedItem aray
        if (response.status === 200) {
          const index = this.items.findIndex((item) => item.id === this.editedItem.id);
          if (index !== -1) {
            this.findAll()
            this.$set(this.items, index, { ...this.editedItem });
            // this.$set(this.items, index, { ...this.items[index], ...this.editedItem });
          }
        this.closeEditItemDialog();
        } else {
          console.error('gagal edit pegawai');
        }
      }catch(err){  
        console.info(err)
      }
    },

    async loadProvinces() {
      try {
        const response = await this.$axios.get('http://localhost:8000/api/provinces');
        this.provinceOptions = response.data;

      } catch (error) {
        console.error('Error loading provinces:', error);
      }
    },

    filterItems() {

    },
  },
  mounted(){
    this.findAll()
    this.loadProvinces();
    // this.addPegawai()
    // this.deletePegawai()
  }
};
</script>
