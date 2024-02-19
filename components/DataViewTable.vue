<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
        </v-col>
        <v-col>
          <v-text-field v-model="search" label="Search" @input="filterItems" />
        </v-col>
        <v-col class="text-right">
          <v-btn @click="openNewItemDialog" color="primary">Tambah Pegawai</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <!-- treeview -->
        <v-col>
          <TreePegawai />
        </v-col>

        <v-col>
      <!-- <p>{{ dataPegawais }}</p> -->
        <v-data-table 
        :headers="headers" 
        :items="filteredItems" 
        item-key="id"
        :options.sync="pagination"
        >
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
      </v-col>
    </v-row>

      <div class="text-xs-center pt-2 md4 lg4">
        <v-pagination
          @input="paginationChangeHandler"
          :value="pagination.page"
          :length="pages"
          :total-visible="pages"
        ></v-pagination>
      </div>

      <!-- New Item Dialog POP UP -->
      <v-dialog v-model="newItemDialog" max-width="600px">
        <v-card>
          <v-card-title>New Item</v-card-title>
          <v-card-text>
            <!-- <v-text-field v-model="newItem.id" label="No"></v-text-field> -->
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
            <v-autocomplete
              v-model="newItem.agama"
              :items="religionOptions"
              item-text="agama"
              item-value="agama"
              label="Agama"
              outlined
              dense
            ></v-autocomplete>
            <v-autocomplete
              v-model="newItem.posisi"
              :items="posisiOptions"
              item-text="name"
              item-value="name"
              label="Posisi Kerja"
              outlined
              dense
            ></v-autocomplete>
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
            <v-file-input v-model="newItem.file" label="Upload Image" accept="image/*"></v-file-input> <!-- masih menggunakan props newItem --> 
            <v-text-field v-model="editedItem.nama" label="Nama"></v-text-field>
            <v-select v-model="editedItem.jenis_kelamin" :items="genderOptions" label="Jenis Kelamin"></v-select>
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
            <v-autocomplete
              v-model="editedItem.agama"
              :items="religionOptions"
              item-text="agama"
              item-value="agama"
              label="Agama"
              outlined
              dense
            ></v-autocomplete>
            <!-- <v-text-field v-model="editedItem.posisi" label="Posisi Kerja"></v-text-field> -->
            <v-autocomplete
              v-model="editedItem.posisi"
              :items="posisiOptions"
              item-text="name"
              item-value="name"
              label="Posisi Kerja"
              outlined
              dense
            ></v-autocomplete>
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
import { mapState } from 'vuex'
export default {
  layout: 'none',
  data() {
    return {
      pagination: { totalItems: 0, rowsPerPage: 6, page: 1 },
      posisiOptions: [],
      religionOptions: [],
      provinceOptions: [],
      deleteConfirmationDialog: false,
      itemToDeleteId: null,
      genderOptions: ['Laki-Laki', 'Perempuan'],
      items: [],
      pegawais: [],
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
    ...mapState({
      dataPegawais: state => state.Pegawai.dataPegawais
    }),

    filteredItems() {
      // return this.dataPegawais.filter((pegawai) =>
      //   pegawai.nama.toLowerCase().includes(this.search.toLowerCase())
      // );
      if (!this.selectedCareerCode) {
        return this.dataPegawais.filter((pegawai) => {
          const searchLowerCase = this.search.toLowerCase();
          return (
            pegawai.nama.toLowerCase().includes(searchLowerCase) ||
            pegawai.jenis_kelamin.toLowerCase().includes(searchLowerCase) ||
            pegawai.provinsi.toLowerCase().includes(searchLowerCase) ||
            pegawai.agama.toLowerCase().includes(searchLowerCase) ||
            pegawai.posisi.toLowerCase().includes(searchLowerCase) 
          );
        });
      }

      return this.dataPegawais.filter((pegawai) =>
        console.log('pegawai.id_posisi: ', pegawai.id_posisi) ||
        console.log('selectedCareerCode', this.selectedCareerCode) ||
        pegawai.id_posisi === this.selectedCareerCode 
      );

      this.dataPegawais.forEach(pegawai => {
        if(pegawai.id_posisi === this.selectedCareerCode){
          console.log('angka nya')
        }
      });

    },

    selectedCareerCode() {
      return this.$store.getters['Pegawai/TreeFilter/selectedCareerCode'];
    },
    
    // filteredItems() {
    //   if (!this.selectedCareerCode) {
    //     return this.dataPegawais;
    //   }

    //   // Filter the data based on the selected career code
    //   return this.dataPegawais.filter((pegawai) =>
    //     pegawai.id_posisi === this.selectedCareerCode
    //   );
    // },

    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      ) {
        return 0;
      }
      return Math.ceil(
        this.pagination.totalItems / this.pagination.rowsPerPage
      );
    }

  },
  methods: {
    // pagination
    paginationChangeHandler(pageNumber) {
      this.pagination.page = pageNumber;
      this.allPegawai(); 
    },
    // pagination close

    openNewItemDialog() {
      this.newItemDialog = true;
    },
    closeNewItemDialog() {
      this.newItemDialog = false;
      // clearing the form of new item after save new item
      this.newItem = { id: "", file: null, nama: "", jenis_kelamin: "", provinsi: "", agama: "", posisi: "", gaji: "" };
    },
    openEditItemDialog(item) {
      this.editedItem = { ...item };
      this.editItemDialog = true;
    },
    closeEditItemDialog() {
      this.editItemDialog = false;
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

    async loadProvinces() {
      try {
        const response = await this.$axios.get('http://localhost:8000/api/provinces');
        this.provinceOptions = response.data;

      } catch (error) {
        console.error('Error loading provinces:', error);
      }
    },

    async loadAgama() {
      try {
        const response = await this.$axios.get('http://localhost:8000/api/religions');
        this.religionOptions = response.data;

      } catch (error) {
        console.error('Error loading provinces:', error);
      }
    },

    async loadPosisi(){
      try{
        const response = await this.$axios.get('http://localhost:8000/api/careers')
        // this.posisiOptions = response.data
        this.posisiOptions = response.data.filter(item => item.tree_lvl === "2")
        // console.log(response.data)
      }catch(err){
        console.log(err)
      }
    },

    // vuex
    async allPegawai(){
      await this.$store.dispatch('Pegawai/findAll')
    },

    async addPegawai() {
      try {

        await this.$store.dispatch('Pegawai/addPegawai', this.newItem);
        this.closeNewItemDialog();
        this.allPegawai()
      } catch (err) {
        console.log('gk berhasil ');
        console.log(err);
      }
    },

    async deletePegawai() {
    try {
      await this.$store.dispatch('Pegawai/deletePegawai', this.itemToDeleteId);
      this.cancelDelete();
      }catch (err) {
        console.error('error:', err);
      }
    },

    async editById() {
    try {
        const formData = new FormData();
        formData.append('_method', 'put');
        formData.append('file', this.newItem.file);
        formData.append('nama', this.editedItem.nama);
        formData.append('jenis_kelamin', this.editedItem.jenis_kelamin);
        formData.append('provinsi', this.editedItem.provinsi);
        formData.append('agama', this.editedItem.agama);
        formData.append('posisi', this.editedItem.posisi);
        formData.append('gaji', this.editedItem.gaji);

        await this.$store.dispatch('Pegawai/editPegawai', { id: this.editedItem.id, formData });
        this.allPegawai()
        this.closeEditItemDialog();
      } catch (err) {
        console.error('error:', err);
      }
    },

    filterItems() {

    },
  },
  mounted(){
    this.allPegawai()
    this.loadProvinces()
    this.loadAgama()
    this.loadPosisi()
    // console.log(this.dataPegawais)
    // this.addPegawai()
    // this.deletePegawai()
  },

  watch: {
    dataPegawais() {
      this.pagination.totalItems = this.dataPegawais.length;
    },
    selectedCareerCode() {
      this.allPegawai()
    },
  },
};
</script>
