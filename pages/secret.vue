<template>
  <div>secret page</div>
</template>

<script>
export default {
  //using this or 
  middleware: ['secret'],

  // or sing this
  // middleware({store, redirect}){
  //   if(!true){
  //     return redirect('/')
  //   }
  // }

}
</script>