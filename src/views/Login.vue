<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login required</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <!-- ERROR MESSAGE HERE <p></p> -->
              <v-text-field
                label="Email"
                prepend-icon="person"
                type="email"
                :rules="formLogin._rules.email"
                required
                clearable
                v-model="formLogin.email">
              </v-text-field>

              <v-text-field
                label="Password"
                prepend-icon="lock"
                type="password"
                :rules="formLogin._rules.password"
                required
                clearable
                v-model="formLogin.password">
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit" tabindex="0" :loading="isProcessing" @click="login()">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      isProcessing: false,
      formLogin: {
        email: '',
        password: '',
        _rules: {
          email: [v => /.+@.+/.test(v) || 'Email is required'],
          password: [v => !!v || 'Password is required']
        }
      }
    }
  },
  methods: {
    async login() {
      let { email, password } = this.formLogin;
      if(!/.+@.+/.test(email) || !password) return;

      this.isProcessing = true;
      try {
        await this.$store.dispatch('signin', { email, password })
        this.$router.push('/');
      } catch(e) {
        console.debug(e);
        // TODO: Check what caused the error, -> show invalid credentials message if necessary
      }
      this.isProcessing = false;
    }
  }
}
</script>