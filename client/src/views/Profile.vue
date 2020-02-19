<template>
  <v-content class="mx-4 mb-4">
    <h1 class="headline grey--text mt-5">Profile</h1>
    <v-container class="my-5">

      <v-layout row class="mb-3">
        <v-btn icon class="gray black--text" @click="$router.push('/')">
          <v-icon>arrow_back_ios</v-icon>
        </v-btn>

        <!-- EDIT MODE BUTTON -->
        <v-btn color="indigo white--text ml-3" :loading="states.loadingUpdate" @click="toggleEditMode()">
          <v-icon left>{{ editMode ? (hasChanges() ? 'save': 'visibility') : 'edit' }}</v-icon>
          <span class="caption">{{ editMode ? (hasChanges() ? 'Save': 'View') : 'Edit' }}</span>
        </v-btn>
      </v-layout>


      <v-row>
        <v-col cols="12" md="6">
          <h3 class="mb-2">Username</h3>
          <v-text-field
            solo
            label="Username"
            append-icon="person"
            :disabled="!editMode"
            v-model="displayName">
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <h3 class="mb-2">Email</h3>
          <v-text-field
            solo
            label="Email"
            append-icon="edit"
            :disabled="!editMode"
            v-model="email">
          </v-text-field>
        </v-col>
      </v-row>
    
    </v-container>
  </v-content>
</template>


<script>
import * as firebase from 'firebase/app';
import 'firebase/firestore';

export default {
  name: 'Profile',
  data() {
    return {
      editMode: false,
      displayName: null,
      email: null,
      states: {
        loadingUpdate: false
      }
    }
  },
  created() {
    const user = firebase.auth().currentUser;
    console.log(user)

    this.displayName = user.displayName;
    this.email = user.email;
  },
  methods: {
    toggleEditMode() {
      if(this.editMode && this.hasChanges()) {
        if(this.email == "" || this.displayName == "") return;

        this.states.loadingUpdate = true
        const user = firebase.auth().currentUser;

        if(this.displayName != user.displayName) {
          firebase.auth().currentUser.updateProfile({
            displayName: this.displayName
          }).then(() => {
            this.states.loadingUpdate = false;
          }).catch((error) => {
            this.displayName = user.displayName;
            this.states.loadingUpdate = false;
          })
        }

        if(this.email != user.email) {
          firebase.auth().currentUser.updateEmail(this.email).then(() => {
            this.states.loadingUpdate = false;
          }).catch((error) => {
            this.email = user.email;
            this.states.loadingUpdate = false;
          })
        }
        
      }
      this.editMode = !this.editMode

    },
    hasChanges() {
      const user = firebase.auth().currentUser;
      return this.email != user.email || this.displayName != user.displayName
    }
  }
}
</script>