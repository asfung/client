export default{
  async findAll({ commit }){
    try{
      const token = localStorage.getItem('token')
      const pegawais = await this.$axios.get('api/v1/pegawai', {
        headers: {
          Authorization: `Bearer ${token}`
        }
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

      if (response.status === 200) {
        commit('UPDATE_PEGAWAI', response.data);
      }else{
        console.log('gagal mengedit')
      }
    } catch (err) {
      console.error('Error editing pegawai:', err);
    }
  },

}