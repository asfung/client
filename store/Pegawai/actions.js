export default{
  async findAll({ commit }){
    try{
      const token = localStorage.getItem('token')
      const pegawais = await this.$axios.get('http://localhost:8000/api/v1/pegawai', {
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

      const pegawaiTambah = await this.$axios.post('http://localhost:8000/api/v1/pegawai', formData, {
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

}