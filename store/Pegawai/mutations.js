export default {
  SET_PEGAWAI(state, payload) {
    state.dataPegawais = payload;
  },
  DELETE_PEGAWAI(state, id) {
    const index = state.dataPegawais.findIndex((pegawai) => pegawai.id === id);
    console.log('terhapus..');
    if (index !== -1) {
      state.dataPegawais.splice(index, 1);
    }
  },
  UPDATE_PEGAWAI(state, editedPegawai) {
    const index = state.dataPegawais.findIndex((pegawai) => pegawai.id === editedPegawai.id);
    if (index !== -1) {
      state.dataPegawais.splice(index, 1, editedPegawai);
    }
  },
};