<template>
  <v-app>
    <!-- Sidebar -->
    <v-navigation-drawer app v-model="drawer" color="accent">
      <v-list>
        <v-list-item class="head-menu">
          <v-list-item-title>Menu</v-list-item-title>
        </v-list-item>
      </v-list>

      <!--  -->
      <v-list dense>
        <v-list-item v-for="(item, index) in items" :key="index" link @click="navigate(index)" :class="{'active': selectedIndex === index}">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-treeview :items="treeItems" activatable @update:active="treeViewHandler"></v-treeview>

    </v-navigation-drawer>

    <!-- TOP BAR -->
    <v-app-bar app color="#66BB6A" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>CRUD | {{ dataLogin.name }}</v-toolbar-title>
      <!-- <v-container> -->
        <v-spacer></v-spacer>
        <!-- <v-card
          class="d-flex flex-row-reverse transparent"
        > -->
          <!-- <v-btn
          color="primary"
          @click="$router.push('/login')"
          class="mr-4"
          >
          Login
          </v-btn> -->
          <v-btn
          color="error"
          class="mr-4"
          @click="logout()"
          >
          Logout
          </v-btn>
          <!-- <Buttonify :kemana='"/"' /> -->
          <v-btn
          color="accent"
          @click="$router.push('/')"
          >
          Home
          </v-btn>

        <!-- </v-card> -->
      <!-- </v-container> -->
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-card v-if="selectedIndex === 0"><DataViewTable /></v-card>
            <!-- <v-card v-if="selectedIndex === 1"><PagingPage /></v-card>
            <v-card v-if="selectedIndex === 2"><TestingTree /></v-card> -->
            <v-card v-if="selectedIndex === 'P1'"><h1>hello world from TECHNOLOGY</h1></v-card>
            <v-card v-if="selectedIndex === 'P2'"><h1>Hello World from BUSINESS</h1></v-card>
            <v-card v-if="selectedIndex === 'P3'"><h1>Hello World from HUMAN RESOURCE</h1></v-card>
            
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import Swal from 'vue-sweetalert2'
export default {
  middleware: ['auth'],
  data() {
    return {
      careersParentMap: new Map(), 
      selectedNode: null,
      treeItems: [],
      dataLogin: "",
      drawer: true,
      selectedIndex: 0, 
      items: [
        { title: 'Data Table', icon: 'mdi-view-dashboard' },
        // { title: 'Ntah', icon: 'mdi-settings' },
        // { title: 'Testing Tree', icon: 'mdi-settings' },
      ]
    };
  },
  methods: {
    treeViewHandler(item) {
      console.log('Tree node clicked:', item);

      this.selectedIndex = item[0];
      console.log(item[0])
      console.log(item.id)
    },
    navigate(index) {
      this.selectedIndex = index;
    },
    async logout(){
      try{
        const token = localStorage.getItem('token')
        await axios.post('http://localhost:8000/api/auth/logout', null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        localStorage.removeItem('token');
        localStorage.removeItem('dataLogin')
        this.$router.push('/login');

        // sweetalert2
        var toastMixin = this.$swal.mixin({
            toast: true,
            icon: 'info',
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
            title: 'Bye.......'
          });

        console.log('byeee......')
      }catch(err){

        // TODO: jalan sementara pake ini dulu 
        
        // const token = localStorage.getItem('token')
        // const refreshToken = await axios.post('http://localhost:8000/api/auth/refresh', null, {
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        // });

        // // set ke yang baru
        // const newToken = refreshToken.data.authorization.token // belum liat preiew response nya, sapa tau bener 
        // localStorage.setItem('token', newToken)
        console.log(`error: ${err}`)
        console.log('ada yang gk beres nih, silahkan login ulang')
        // localStorage.removeItem('token')
        // localStorage.removeItem('dataLogin')
        // window.location.href = "/login"

      }
    },

    transformDataForTreeView(apiResponse) {
    // Create a map to store items based on career_code
    const careerCodeMap = new Map();

    // Iterate over the API response to build the tree structure
    apiResponse.forEach((item) => {
      const { id, career_code, name } = item;

      // Check if the career_code already exists in the map
      if (careerCodeMap.has(career_code)) {
        // Add the node to the existing career_code
        careerCodeMap.get(career_code).children.push({ id, name });
      } else {
        // Create a new career_code entry in the map
        careerCodeMap.set(career_code, { id: career_code, name: career_code, children: [{ id, name }] });
      }
    });

    // Iterate over the transformed treeItems and add names from careers_parent
    const treeItems = Array.from(careerCodeMap.values());
    treeItems.forEach((item) => {
      const nameFromParent = this.careersParentMap.get(item.id);
      if (nameFromParent) {
        item.name = nameFromParent;
      }
      // Iterate over children, if present
      if (item.children) {
        item.children.forEach((child) => {
          const nameFromChildParent = this.careersParentMap.get(child.id);
          if (nameFromChildParent) {
            child.name = nameFromChildParent;
          }
        });
      }
    });

    return treeItems;
    },
    async fetchCareerData() {
      try {
        const response = await axios.get('http://localhost:8000/api/careers');
        // Transform the API response for v-treeview
        this.treeItems = this.transformDataForTreeView(response.data);
      } catch (error) {
        console.error('Error fetching career data:', error);
      }
    },
    async fetchCareersParentData() {
    try {
      const response = await axios.get('http://localhost:8000/api/careers_parent');
      // Create a map from careers_parent data for easy lookup
      response.data.forEach((item) => {
        this.careersParentMap.set(item.career_code, item.name);
      });
    } catch (error) {
      console.error('Error fetching careers_parent data:', error);
    }
  },

  },
  mounted(){
    const dataLoginStorage = localStorage.getItem('dataLogin')
    this.dataLogin = JSON.parse(dataLoginStorage)    
    this.fetchCareersParentData();
    this.fetchCareerData();
  }
};
</script>

<style>
.active {
  background-image: linear-gradient(to right, red , yellow);
  color: #ffffff; 
}

.head-menu{
  background-image: linear-gradient(to right, #d10f0f , #d4d64b);
}

</style>
