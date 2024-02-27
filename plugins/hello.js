export default ({ app }, inject) => {
  // Inject $hello(msg) in Vue, context and store.
  inject('hello', msg => console.log(`Hello ${msg}!`))

  inject('nama', nama => console.log(`halo apakabar ${nama}!`))

}