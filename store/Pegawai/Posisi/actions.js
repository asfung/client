export default{
  async addPosisi({name, id}){
    try{
      const token = localStorage.getItem('token')
      this.$axios.get('api/v1/posisi', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          name: name,
          id_posisi: id
        }
      })
    }catch(err){
      console.log(err)
    }
  }
}