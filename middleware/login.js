export default function ({ redirect }) {
  const token = localStorage.getItem('token')
  if(token){
    redirect('/ui')
  }
}
