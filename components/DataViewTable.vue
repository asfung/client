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
          <v-btn @click="openImportDialog">Import Excel</v-btn>
          <v-btn @click="downloadExcel" color="error">Download Excel</v-btn>
          <v-btn @click="openNewItemDialog" color="primary">Tambah Pegawai</v-btn>
        </v-col>
      </v-row>

      <v-row>
        <!-- treeview -->
        <v-col>
          <h1 class="d-flex">Filter Posisi</h1>
          <TreePegawai />
        </v-col>

        <v-col>
      <!-- <p>{{ dataPegawais }}</p> -->
        <v-data-table
        :headers="headers"
        :items="filteredItemsTable"
        item-key="id"
        :options.sync="pagination"
        disable-pagination
        hide-default-footer
        :loading="loadingData"
        >
          <template v-slot:item="props">
            <tr>
              <td>{{ props.item.id }}</td>
              <td>
                <!-- <img :src="`http://localhost:8000/storage/photo/${props.item.file}`" alt="gambar" style="max-width: 50px; max-height: 50px;"> -->
                <!-- <img v-if="getImage(props.item.file)" :src="getImage(props.item.file)" alt="gambar" style="max-width: 50px; max-height: 50px;"> -->
                <!-- <p>{{ getImage(props.item.file, props.item.id) }}</p> -->
                <img v-if="imageUrls[props.item.id]" :src="imageUrls[props.item.id]" alt="gambar" style="max-width: 50px; max-height: 50px;">
                <p v-else-if="!imageUrls[props.item.id]">Loading..</p>
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
            <v-text-field
              v-model="newItem.posisi"
              label="Posisi Kerja"
              outlined
              dense
              @click="openPosisiDialog"
              readonly
            ></v-text-field>
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
            <v-text-field
              v-model="editedItem.posisi"
              label="Posisi Kerja"
              outlined
              dense
              @click="openEditPosisiDialog"
              readonly
            ></v-text-field>
            <v-text-field v-model="editedItem.gaji" label="Salary" type="number"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <!-- <v-btn @click="saveEditedItem" color="primary">Save</v-btn> -->
            <v-btn @click="editById" color="primary">Save</v-btn>
            <v-btn @click="closeEditItemDialog" color="error">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Import Excel Dialog -->
      <v-dialog v-model="importDialog" max-width="600">
        <v-card>
          <v-card-title>Import Excel</v-card-title>
          <v-card-text>
            <p>Sebelum Mengimport File, Download Template Terlebih Dahulu</p>
            <a href="/template_pegawai.xlsx" download>Download Template</a>
            <!-- <input type="file" @change="handleFileUpload" accept=".xls, .xlsx"> -->
            <v-file-input v-model="excelFile" @change="handleFileUpload" label="Upload Excel" accept=".xls, .xlsx"></v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="importExcel" color="primary">Import</v-btn>
            <v-btn @click="closeImportDialog" color="error">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- posisi dialog -->
      <v-dialog v-model="posisiDialog" max-width="600">
        <v-card>
          <v-card-title>Select Posisi</v-card-title>
          <v-card-text>
            <TreeInput />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="closePosisiDialog" color="primary">Select</v-btn>
            <v-btn @click="cancelPosisiSelection" color="error">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- edit posisi dialog -->
      <v-dialog v-model="editPosisiDialog" max-width="600">
        <v-card>
          <v-card-title>Select Posisi</v-card-title>
          <v-card-text>
            <TreeInput />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="closeEditPosisiDialog" color="primary">Select</v-btn>
            <v-btn @click="cancelEditPosisiSelection" color="error">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- konfirmasi -->
      <v-dialog v-model="deleteConfirmationDialog" max-width="400">
        <v-card>
          <v-card-title>r u sure?</v-card-title>
          <v-card-actions>
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
      imageUrls: {}, 
      editPosisiDialog: false,
      posisiDialog: false,
      loadingData: false,
      excelFile: null,
      importDialog: false,
      filteredItems: [],
      pagination: { totalItems: 0, rowsPerPage: 5, page: 0 },
      deleteConfirmationDialog: false,
      itemToDeleteId: null,
      genderOptions: ['Laki-Laki', 'Perempuan'],
      items: [],
      pegawais: [],
      headers: this.$store.state.Pegawai.headers,
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
      dataPegawais: state => state.Pegawai.dataPegawais,
      provinceOptions: state => state.Pegawai.provinceOptions,
      religionOptions: state => state.Pegawai.religionOptions,
      // headers: state => state.Pegawai.headers
    }),

    selectedCareerCode() {
      return this.$store.getters['Pegawai/TreeFilter/selectedCareerCode'];
    },

    selectedId() {
      return this.$store.getters['Pegawai/getSelectedId'];
    },

    filteredItemsTable() {
      if (!this.selectedCareerCode) {
        // this.allPegawai()
        return this.dataPegawais.data
      }

      return this.filteredItems.data;
    },

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
      console.log('Pagination changed:', pageNumber);
      console.log('Current pagination:', this.pagination);
      this.pagination.page = pageNumber;
      // this.pagination.rowsPerPage = this.pagination.rowsPerPage;

      console.log('Current pagination:', this.pagination);
      this.allPegawai();
    },
    // pagination close

    // posisi kerja treeview open
    openPosisiDialog() {
      this.posisiDialog = true;
    },
    closePosisiDialog() {
      this.posisiDialog = false;
    },
    cancelPosisiSelection() {
      this.closePosisiDialog();
    },
    // posis kerja treeview close


    // edit posisi kerja open
    openEditPosisiDialog() {
      this.editPosisiDialog = true;
    },
    closeEditPosisiDialog() {
      this.editPosisiDialog = false;
    },
    cancelEditPosisiSelection() {
      this.closeEditPosisiDialog();
    },
    // edit posisi kerja close


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
      console.log(this.editedItem)
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

    openImportDialog() {
      this.selectedFile = null;
      this.importDialog = true;
    },

    closeImportDialog() {
      this.importDialog = false;
      this.excelFile = null
    },

    handleFileUpload(event) {
      console.log(event)
      this.excelFile = event

    },

    async loadProvinces() {
      try {
        await this.$store.dispatch('Pegawai/loadProvinces')
      } catch (error) {
        console.error('Error loading provinces:', error);
      }
    },

    async loadAgama() {
      try {
        await this.$store.dispatch('Pegawai/loadAgama')
      } catch (error) {
        console.error('Error loading provinces:', error);
      }
    },


    // vuex
    async allPegawai(){
      this.loadingData = true
      try {
        await this.$store.dispatch('Pegawai/findAll', {page: this.pagination.page, name: this.search, id_posisi: this.selectedCareerCode});
        this.pagination.totalItems = this.dataPegawais.total_items
        this.filteredItems = this.dataPegawais
      } catch (err) {
        console.error('Error fetching paginated data:', err);
      }finally{
        this.loadingData = false
      }
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

    async downloadExcel() {
      await this.$store.dispatch('Pegawai/downloadExcel', this.selectedCareerCode)
    },

    async importExcel() {
      try{
        const dataFile = new FormData()
        dataFile.append('excel_file', this.excelFile)
        await this.$store.dispatch('Pegawai/importExcel', dataFile)
        this.allPegawai()
        this.closeImportDialog();
      }catch(err){
        console.log(err)
      }
    },

    // async getImage(namefile){
    //   try{
    //     const url = await this.$store.dispatch('Pegawai/getImage', namefile)
    //     console.log(url) 
    //     return url
    //   }catch(err){
    //     console.log(err)
    //   }
    // },

    // async getImage(namefile, itemId){
    //   try{
    //     const url = await this.$store.dispatch('Pegawai/getImage', namefile)
    //     this.$set(this.imageUrls, itemId, url);
    //     return this.imageUrls[itemId];
    //   }catch(err){
    //     console.log(err)
    //   }
    // },

    async loadImage(item) {
      try {
        const itemId = item.id;
        if (!this.imageUrls[itemId]) {
          console.log(item)
          const url = await this.$store.dispatch('Pegawai/getImage', item.file);
          console.log(`Image URL for item ${itemId}: ${url}`);
          this.$set(this.imageUrls, itemId, url);
        }
      } catch (err) {
        console.error(err);
      }
    },

    async loadImages(items) {
      for (const item of items) {
        await this.loadImage(item);
      }
    },

    async filterItems() {
      this.allPegawai();
    },
  },

  mounted(){
    this.allPegawai()
    this.loadProvinces()
    this.loadAgama()
    this.selectedCareerCode
    this.selectedId
  },

  created() {
    this.loadImages(this.filteredItemsTable); // mengeload data dari table
  },

  watch: {
    selectedCareerCode() {
      this.allPegawai()
    },
    selectedId(){
      console.log(this.selectedId)
      this.newItem.posisi = this.selectedId.name
      this.editedItem.posisi = this.selectedId.name
    },
    filteredItemsTable: {
      handler(newItems) {
        this.loadImages(newItems);
      },
      deep: true,
    },
  },
};
</script>
