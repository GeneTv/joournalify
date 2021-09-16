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
      <v-btn text color="white" icon v-on:click="openProfile">
        <v-icon>person</v-icon>
      </v-btn>
      <v-btn text color="white" icon v-on:click="logout">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    openProfile() {
      this.$router.push('/profile');
    },
    async logout() {
      await this.$store.dispatch('signout');
      this.$router.push('/login');
    }
  }
};
</script>
