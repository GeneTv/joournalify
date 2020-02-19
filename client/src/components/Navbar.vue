<template>
  <nav>
    <v-app-bar text app class="primary">
      <v-toolbar-title class="text-uppercase white--text headline">
        <span>J</span>
        <span class="font-weight-bold">OO</span>
        <span>urnalify </span>
        <span class="caption">BETA</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text color="white" icon v-on:click="$router.push('/profile')">
        <v-icon>person</v-icon>
      </v-btn>
      <v-btn text color="white" icon v-on:click="logout">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>
  </nav>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Navbar',
  methods: {
    async logout() {
      await firebase.auth().signOut();
      this.$router.push('/login')
    }
  }
};
</script>