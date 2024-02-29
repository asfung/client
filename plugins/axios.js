export default ({ $axios }) => {
  $axios.onRequest(config => {
    config.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  });
}