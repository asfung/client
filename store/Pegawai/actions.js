import { watch } from "vue";
import Swal from 'vue-sweetalert2'

export default{
  async findAll({ commit }, {page, name, id_posisi}){
    try{
      const token = localStorage.getItem('token')
      const pegawais = await this.$axios.get('api/v1/pegawai', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: page,
          name: name,
          id_posisi: id_posisi
        },
      });

      // this.items = pegawais.data
      commit('SET_PEGAWAI', pegawais.data)
    }catch(err){
      console.log(err)
      // token expired exception
      localStorage.removeItem('token')
      console.log('harap login ulang')
      window.location.href = "/login"
    }
  },

  async forcingAllPegawai({commit}){
    try{
      const token = localStorage.getItem('token')
      const response = await this.$axios.get('api/v1/pegawais', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      commit('SET_FORCING_ALL', response.data)

    }catch(err){
      console.log(err)
    }
  },
  

  async addPegawai({ commit }, newItem) {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', newItem.file);
      // formData.append('file', new File([newItem.file], newItem.file.name));
      formData.append('nama', newItem.nama);
      formData.append('jenis_kelamin', newItem.jenis_kelamin);
      formData.append('provinsi', newItem.provinsi);
      formData.append('agama', newItem.agama);
      formData.append('posisi', newItem.posisi);
      formData.append('gaji', newItem.gaji);

      const pegawaiTambah = await this.$axios.post('api/v1/pegawai', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(pegawaiTambah.data);
      // commit('SET_PEGAWAI', pegawaiTambah.data);
    } catch (err) {
      console.log('gk berhasil from actions.js');
      console.log(err);
    }
  },

  async deletePegawai({ commit }, id) {
    try {
      const token = localStorage.getItem('token');
      await this.$axios.delete(`api/v1/pegawai/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      commit('DELETE_PEGAWAI', id);
    } catch (err) {
      console.error('Error deleting pegawai:', err);
    }
  },

  async editPegawai({ commit }, { id, formData }) {
    try {
      const token = localStorage.getItem('token');
      const response = await this.$axios.post(`api/v1/pegawai/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      if (response.status === 200) {
        commit('UPDATE_PEGAWAI', response.data);
      }else{
        console.log('gagal mengedit')
      }
    } catch (err) {
      console.error('Error editing pegawai:', err);
    }
  },

  async searchPegawai({commit}, nama){
    try{
      const token = localStorage.getItem('token')
      const pegawai = await this.$axios.get(`api/v1/pegawai/search?nama=${nama}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      commit('SET_PEGAWAI_DATA', pegawai.data)
      // console.log(pegawai.data)
    }catch(err){
      // console.log(err)
      console.log('not found')
    }
  },

  async findIdPosisi({ commit }, { page, id_posisi }) {
    try {
      const token = localStorage.getItem('token')
      if(id_posisi !== null){
        const response = await this.$axios.get(`http://localhost:8000/api/v1/pegawai/cari?id_posisi=${id_posisi}&page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // commit('SET_PEGAWAI_DATA', response.data);
        commit('SET_PEGAWAI_DATA', response.data.data);
        // commit('SET_FILTERED_DATA', filteredData);
      }
    } catch (error) {
      console.error('Error searching pegawai:', error);
    }
  },

  async downloadExcel({commit} , id_posisi){
    try {
      const token = localStorage.getItem('token')
      if(id_posisi !== null){
        const response = await this.$axios.get(`api/v1/excel/pegawai?id_posisi=${id_posisi}`, {
          responseType: 'blob',
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `pegawai_${id_posisi}.xlsx`;

        // Append the link to the document and trigger the click event
        document.body.appendChild(link);
        link.click();

        // Clean up by removing the link from the document
        document.body.removeChild(link);
      }else{
        const response = await this.$axios.get(`api/v1/excel/pegawai?id_posisi=`, {
          responseType: 'blob',
          headers:{
            Authorization: `Bearer ${token}`
          }
        })
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        // Create a link element to trigger the download
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'pegawai_all.xlsx';

        // Append the link to the document and trigger the click event
        document.body.appendChild(link);
        link.click();

        // Clean up by removing the link from the document
        document.body.removeChild(link);
      }

    }catch(err){
      console.log(err)
    }
  },

  async importExcel({commit} , file){
    try{
      const token = localStorage.getItem('token')
      // const response = await this.$axios.post('api/v1/excel/pegawai/imports', file, {
      const response = await this.$axios.post('api/v1/excel/pegawai/import', file, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      })

      console.log(response.data)
      if(response.status === 201){
        var toastMixin = this.$swal.mixin({
          toast: true,
          icon: 'success',
          title: 'General Title',
          animation: false,
          position: 'top-right',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: false,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        toastMixin.fire({
          animation: true,
          title: `Berhasil, Data Telah DiImport`
        });
      }

    }catch(err){
      var toastMixin = this.$swal.mixin({
          toast: true,
          icon: 'error',
          title: 'General Title',
          animation: false,
          position: 'top-right',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: false,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });
        toastMixin.fire({
          animation: true,
          title: 'Tidak Berhasil, Maaf Ada Kesalahan!'
        });
      console.log(err)
    }
  },
  
  setSelectedId({commit}, id){
    commit('SET_SELECTEDID', id)
  },

  updateFilteredData({ commit }, filteredData) {
    commit('SET_FILTERED_DATA', filteredData);
  },

}
