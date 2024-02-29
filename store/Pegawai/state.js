export default () => ({
  dataPegawais: [],
  forcingAllPegawai: [],
  selectedId: null,
  provinceOptions: null,
  religionOptions: null,
  headers: [
    { text: "No", value: "id" },
    { text: "Image", value: "file"},
    { text: "Nama", value: "nama" },
    { text: "Jenis Kelamin", value: "jenis_kelamin" },
    { text: "Provinsi", value: "provinsi" },
    { text: "Agama", value: "agama" },
    { text: "Posisi Kerja", value: "posisi" },
    { text: "Gaji", value: "salary" },
    { text: "Actions", value: "actions", sortable: false },
  ],
  // posisiOptions: null, // DEPRECATED
})