<template>
  <v-card elevation="5" height="400" width="400" outlined class="form-login">
    <v-card-title> Login </v-card-title>

    <v-card-text class="">
      <v-text-field
        label="Name"
        :rules="[rules.required]"
        v-model="name"
      ></v-text-field>
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
      <v-btn color="primary" @click="$router.push('/login')"> Back </v-btn>
      <v-btn color="#263238" @click="registrasi"> Submit </v-btn>
      <v-btn color="error" @click="$router.push('/')"> Balik Kerumah </v-btn>
      <!-- <v-btn color="secondary" @click="testSweetAlert"> Test </v-btn> -->
    </v-card-actions>
  </v-card>
</template>

<style>
.form-login {
  margin: auto;
}
</style>

<script>
import axios from "axios";
export default {
  layout: "loginLayout",
  //not working
  // css: [
  //   '@/assets/login.css'
  // ],

  data() {
    return {
      show1: false,
      show2: true,
      show3: false,
      show4: false,
      name: "",
      email: "",
      password: "",
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        emailRules: (value) =>
          /.+@.+\..+/.test(value) || "E-mail must be valid",
      },
    };
  },

  methods: {
    async registrasi() {
      try {
        console.log("trying to regiss....");
        const response = await axios.post(
          "http://localhost:8000/api/auth/register",
          {
            name: this.name,
            email: this.email,
            password: this.password,
          }
        );
        console.log("response", response);

        // this.$swal({
        //   title: "Good job!",
        //   text: "You clicked the button!",
        //   icon: "success",
        // });
        this.testSweetAlert()

        this.$router.push("/login");
      } catch (error) {
        console.error("Error regis in:", error);
      }
    },

    testSweetAlert() {
      this.$swal({
        title: "Anda berhasil membuat akun 🥳",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(https://img.freepik.com/free-photo/abstract-textured-backgound_1258-30484.jpg?w=740&t=st=1707725643~exp=1707726243~hmac=fc64872c50ae11e4f2ebfa6558ee536322c1b8076e705bd9712352d110abfbe5)",
        backdrop: `
          rgba(107,255,111,0.15)
          url("https://sweetalert2.github.io/images/nyan-cat.gif")
          left top
          no-repeat
        `,
      });

      // this.notif()
    },

    notif(){
      this.$swal({
        title: "Sweet!",
        text: "Modal with a custom image.",
        imageUrl: "https://giphy.com/gifs/manutd-manchester-united-mufc-ggmu-hryis7A55UXZNCUTNA",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image"
      })
    }
  },
};
</script>