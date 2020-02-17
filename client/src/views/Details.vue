<template>
  <v-content class="mx-4 mb-4">
    <h1 class="headline grey--text mt-5">Details</h1>
    <v-container class="my-5">

      <v-layout row class="mb-3">
        <v-btn color="success grey" v-if="isAuthor" v-on:click="toggleEditMode()" :loading="loading">
          <v-icon left>{{ editMode ? (hasChanges() ? 'save': 'edit') : 'edit' }}</v-icon>
          <span class="caption">{{ editMode ? (hasChanges() ? 'Save': 'Exit editor') : 'Edit' }}</span>
        </v-btn>
      </v-layout>


      <v-row>
        <v-col cols="12" md="12">
          <h3 class="mb-3">Reflection</h3>
          <v-textarea solo label="Reflection" :disabled="!editMode" v-model="details.reflection"></v-textarea>
        </v-col>
        <v-col cols="12" md="12">
          <h3 class="mb-3">Notes</h3>
          <v-textarea solo label="Notes" :disabled="!editMode" v-model="details.notes"></v-textarea>
        </v-col>
      </v-row>
    </v-container>



  </v-content>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/firestore';

export default {
  data() {
    return {
      details: {},
      detailsOrigin: {},
      isAuthor: false,
      editMode: false,
      loading: false
    }
  },
  created() {
    const id = this.$route.params.id
    const user = firebase.auth().currentUser;

    console.log(`Fetching details for ${id}`)
    firebase.firestore().collection('journals').doc(id).get().then((doc) => {
      if(doc.exists) {
        this.details = {id: doc.id, ...doc.data()}
        this.isAuthor = this.details.author == user.uid;
        if(this.isAuthor)
          this.detailsOrigin = {...this.details}
      } else { this.$router.push('/') }
    }).catch((error) => {
      this.$router.push('/')
      console.log(error)
    });
  },
  methods: {
    translateDate(timestamp) {
      var date = new Date(timestamp)
      var days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`
    },
    toggleEditMode() {
      if(this.isAuthor) {
        if(this.editMode && hasChanges()) {
          this.loading = true
          //TODO Save
        }
        this.editMode = !this.editMode
      }
    },
    hasChanges() {
      console.log(this.details.reflection != this.detailsOrigin.reflection)
      console.log(this.details.notes != this.detailsOrigin.notes)
      return this.details.reflection != this.detailsOrigin.reflection ||
        this.details.notes != this.detailsOrigin.notes
    }
  }
}
</script>

<style>

</style>