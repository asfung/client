export default function ({ redirect }) {
  const token = localStorage.getItem('token')
  if(!token){
    redirect('/login')
    console.log('eitsss gk bisa harus ada token ')
  }
  if(token){
    console.log('token nya ada bang')
  }

}
