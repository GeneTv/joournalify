<template>
  <v-content class="mx-4 mb-4">
    <h1 class="headline grey--text mt-5">Dashboard</h1>


    <v-container class="my-5">

      <v-layout row class="mb-3">
        <v-btn text color="success text--grey" :loading="states.loadingCreate" @click="createJournal()">
          <v-icon left>add_to_photos</v-icon>
          <span class="caption">Add</span>
        </v-btn>

        <v-dialog v-model="states.dialogOpen" max-width="600">
          <template v-slot:activator="{ on }">
            <v-btn text color="grey darken-1" class="float-right" tabindex="-1" v-on="on"><v-icon left>search</v-icon> Open</v-btn>
          </template>
          
          <v-card>
            <v-card-title class="headline indigo darken-1 white--text" primary-title>Open journal</v-card-title>
            <v-card-text class="mt-4 body-1 black--text">Enter the journal ID to open it</v-card-text>
            <v-form>
              <v-text-field label="ID" prepend-icon="unarchive" class="pa-5"
                type="text"
                required
                :rules="[openJournalID => !!openJournalID || 'ID is required']"
                v-model="openJournalID">
              </v-text-field>
            </v-form>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text tabindex="0" @click="states.dialogOpen = false">Cancel</v-btn>
              <v-btn color="indigo darken-2 white--text" tabindex="-1" @click="openJournal()">Open</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>

      <h1 class="mt-12 text-center grey--text" v-if="journals.length == 0">No entries found</h1>
      <v-card text elevation-2 class="mb-5" v-for="journal in journals" :key="journal.id" router :to="`/details/${journal.id}`">
        <v-layout row wrap :class="`pa-3 entry`">
          <v-flex xs12 md6>
            <div class="caption grey--text">Date</div>
            <h1>{{ translateDate(journal.date) }}</h1>
          </v-flex>
        </v-layout>
      </v-card>


    </v-container>
  </v-content>
</template>


<script>
import * as firebase from 'firebase/app';
import 'firebase/firestore';

export default {
  name: 'Dashboard',
  data() {
    return {
      journals: [],
      states: {
        loadingCreate: false,
        dialogOpen: false
      },
      openJournalID: ""
    }
  },
  created() {
    const user = firebase.auth().currentUser;
    firebase.firestore().collection('journals').where('author', '==', user.uid).get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        this.journals.push({ id: doc.id, date: doc.data().date })
      })
    })
  },
  methods: {
    createJournal() {
      const user = firebase.auth().currentUser
      this.states.loadingCreate = true
      firebase.firestore().collection('journals').add({
        author: user.uid,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        tasks: [],
        completed: [],
        reflection: "",
        notes: ""
      }).then(docRef => {
        this.$router.push(`/details/${docRef.id}`)
      }).catch(error => {
        this.states.loadingCreate = false
      })
    },
    openJournal() {
      if(this.openJournalID == "") return
      this.$router.push(`/details/${this.openJournalID}`)
      this.openJournalID = ""
    },
    translateDate(timestamp) {
      var date = new Date(timestamp.seconds*1000)
      var days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`
    }
  }
}
</script>

<style scoped>
.entry {
  background: #fff;
}
</style>