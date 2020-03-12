<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Reset password</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <!-- ERROR MESSAGE HERE <p></p> -->
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
            <v-btn color="primary" type="submit" tabindex="0" :loading="loggingIn" @click="reset()">Reset</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'PasswordReset',
  data() {
    return {
      inputPassword: ""
    }
  },
  methods: {
    reset() {
      if(!this.inputPassword) return;

      firebase.auth().confirmPasswordReset(this.$route.params.resetToken, inputPassword)
      .then(() => {
        this.$router.push('/')
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>