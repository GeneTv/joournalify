<template>
  <v-app>
    <Navbar v-if="loggedIn"/>
    <router-view/>
  </v-app>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';
//
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar,
  },
  data() {
    return {
      loggedIn: false
    }
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.loggedIn = !!user;
    })
  }
};
</script>
