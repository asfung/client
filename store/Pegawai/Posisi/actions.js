export default{
  async addPosisi({ commit }, {name, id}){
    try{
      const token = localStorage.getItem('token')
      this.$axios.get(`api/v1/posisi?name=${name}&id_tree=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // console.log(typeof(name), typeof(id))
      console.log(name, id)
    }catch(err){
      console.log(err)
    }
  },

  async editPosisi({commit}, {name, id}){
    try{
      const token = localStorage.getItem('token')
      this.$axios.get(`api/v1/posisi/${id}?name=${name}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

    }catch(err){
      console.log(err)
    }

  },
}