export default ({ $axios }) => {
  $axios.setBaseURL('http://localhost:8000/');
  $axios.onRequest(config => {
    config.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  });
}
