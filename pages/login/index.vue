<template>
  <v-card
  elevation="5"
  height="400"
  width="400"
  outlined
  class="form-login"
  >
    <v-card-title>
      Login
    </v-card-title>

    <v-card-text class="">
      <v-text-field 
      label="Email"
      :rules="[rules.required, rules.emailRules]"
      v-model="email"
      ></v-text-field>
      <!-- <v-text-field label="Password" ></v-text-field> -->
      <v-text-field
        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="[rules.required]"
        :type="show2 ? 'text' : 'password'"
        name="input-10-2"
        label="Password"
        hint="At least 8 characters"
        value=""
        class="input-group--focused"
        @click:append="show2 = !show2"
        v-model="password"
      ></v-text-field>
    </v-card-text>

  <v-card-actions class="justify-center">
    <v-btn
    color="#263238"
    @click="handlerLogin()"
    >
    Login
    </v-btn>

    <v-btn
    color="primary"
    @click="$router.push('/register')"
    >
    Register
    </v-btn>
    <v-btn
    color="error"
    @click="$router.push('/')"
    >
    Balik Kerumah
    </v-btn>
  </v-card-actions>

  </v-card>

</template>

<style>
  .form-login{
    margin: auto;
  }

</style>

<script>
  import axios from 'axios';
  import Swal from 'vue-sweetalert2'
  export default {
    layout: 'loginLayout',
    //not working
    // css: [
    //   '@/assets/login.css'
    // ],

    data(){
      return {
        show1: false,
        show2: true,
        show3: false,
        show4: false,
        email: '',
        password: '',
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          emailRules: value => /.+@.+\..+/.test(value) || 'E-mail must be valid',
        },
      }
    },

    methods: {
      async handlerLogin(){
        try {
          console.log('trying to logging....')
          const response = await axios.post('http://localhost:8000/api/auth/login', {
            email: this.email,
            password: this.password,
          });
          console.log('response', response)
          const token = response.data.authorization.token;
          console.log('token mu bang gk papa diliatin : ', token)
          // ada di ~/.config/chromium/default/local\ storage/
          localStorage.setItem('token', token);
          localStorage.setItem('dataLogin', JSON.stringify(response.data.user))

          this.$router.push('/ui');

          const getDataLoginStorage = localStorage.getItem('dataLogin')
          const dataLogin = JSON.parse(getDataLoginStorage)

          var toastMixin = this.$swal.mixin({
            toast: true,
            icon: 'success',
            title: 'General Title',
            animation: false,
            position: 'top-right',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          });
          toastMixin.fire({
            animation: true,
            title: `anda login sebagai ${dataLogin.name}`
          });
        } catch (error) {
            console.error('Error logging in:', error);
            // window.alert('Login failed. Please check your credentials.');
        }
      },
      

    }

  }
</script>