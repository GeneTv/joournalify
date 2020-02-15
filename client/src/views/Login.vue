<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login required</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  label="Email"
                  prepend-icon="person"
                  type="email"
                  :rules="[inputUsername => /.+@.+/.test(inputUsername) || 'Email is required']"
                  required
                  clearable
                  v-model="inputUsername">
                </v-text-field>

                <v-text-field
                  label="Password"
                  prepend-icon="lock"
                  type="password"
                  :rules="[inputPassword => !!inputPassword || 'Password is required']"
                  required
                  clearable
                  v-model="inputPassword">
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" submit v-on:click="login()" :loading="loggingIn">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Login',
  data() {
    return {
      loggingIn: false,
      inputUsername: "",
      inputPassword: ""
    }
  },
  methods: {
    login() {

      if(!this.inputUsername || !this.inputPassword) return;


      this.loggingIn = true;
      const promise = firebase.auth().signInWithEmailAndPassword(this.inputUsername, this.inputPassword)
      promise.then(user => {
        this.loggingIn = false;
        this.$router.push('/')
      }).catch(e => {
        this.loggingIn = false;
        console.log(e)
      });
    }
  }
}
</script>