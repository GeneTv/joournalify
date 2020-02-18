<template>
  <v-content class="mx-4 mb-4">
    <h1 class="headline grey--text mt-5">Details{{ details.date != null ? ` - ${translateDate(details.date)}` : '' }}</h1>
    <v-container class="my-5">

      <v-layout row class="mb-3">
        <v-btn icon class="gray black--text" @click="$router.push('/')">
          <v-icon>arrow_back_ios</v-icon>
        </v-btn>

        <!-- EDIT MODE BUTTON -->
        <v-btn class="indigo white--text ml-3" v-if="isAuthor" :loading="states.loadingSave" @click="toggleEditMode()">
          <v-icon left>{{ editMode ? (hasChanges() ? 'save': 'visibility') : 'edit' }}</v-icon>
          <span class="caption">{{ editMode ? (hasChanges() ? 'Save': 'View') : 'Edit' }}</span>
        </v-btn>

        <!-- GIVE FEEDBACK DIALOG -->
        <v-dialog v-model="states.dialogFeedback" max-width="600" v-if="!details.fetching && !isAuthor">
          <template v-slot:activator="{ on }">
            <v-btn color="amber" class="ml-3" v-on="on"><v-icon left>feedback</v-icon> Give feedback</v-btn>
          </template>
          
          <v-card>
            <v-card-title class="headline amber darken-1 white--text" primary-title>Write feedback</v-card-title>
            <v-container>
              <v-textarea solo label="Write feedback..." v-model="feedbackCache"></v-textarea>
            </v-container>
            
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text tabindex="0" @click="states.dialogFeedback = false">Cancel</v-btn>
              <v-btn color="amber darken-2 white--text" tabindex="-1" :loading="states.loadingFeedback" @click="createFeedback()">Write</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-layout>

      <v-row>
        <v-col cols="12" md="12">
          <h3 class="mb-2">Reflection</h3>
          <v-textarea solo label="Reflection" :disabled="!editMode" v-model="details.reflection"></v-textarea>
        </v-col>
        <v-col cols="12" md="12">
          <h3 class="mb-2">Notes</h3>
          <v-textarea solo label="Notes" :disabled="!editMode" v-model="details.notes"></v-textarea>
        </v-col>
      </v-row>

      <!-- DELETE CONFIRMATION -->
      <v-dialog v-model="states.dialogDelete" max-width="600" v-if="isAuthor">
        <template v-slot:activator="{ on }">
          <v-btn text color="red darken-1" class="float-right" tabindex="-1" v-on="on"><v-icon left>delete</v-icon> Delete</v-btn>
        </template>
        
        <v-card>
          <v-card-title class="headline red darken-1 white--text" primary-title>Delete</v-card-title>
          <v-card-text class="mt-4 body-1 black--text">Are you sure, you want to <b>delete</b> this entry? This action is <b>irrevocable</b>!</v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" text tabindex="0" @click="states.dialogDelete = false">Cancel</v-btn>
            <v-btn color="red darken-2 white--text" tabindex="-1" @click="deleteJournal()">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-card class="mx-auto" tile>
        <hr class="amber" color="amber">
        <v-list>
          <v-subheader class="font-weight-bold">Feedback</v-subheader>
          <v-list-item-group v-model="feedback" color="primary">
            <v-list-item v-for="feedback in details.feedback" :key="feedback.id">
              <v-list-item-content>
                <v-list-item-title>{{ feedback.author }}</v-list-item-title>
                <v-list-item-subtitle>{{ feedback.text }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
      
    </v-container>
  </v-content>
</template>

<script>
import * as firebase from 'firebase/app';
import 'firebase/firestore';

export default {
  data() {
    return {
      details: { fetching: true },
      detailsOrigin: {},
      feedbackCache: "",
      isAuthor: false,
      editMode: false,
      states: {
        dialogFeedback: false,
        loadingFeedback: false,
        dialogDelete: false,
        loadingSave: false
      }
    }
  },
  created() {
    const id = this.$route.params.id
    const user = firebase.auth().currentUser;

    /* Load journal by id */
    firebase.firestore().collection('journals').doc(id).get().then((doc) => {
      if(doc.exists) {
        this.details = { id: doc.id, ...doc.data(), feedback: [] }
        this.isAuthor = this.details.author == user.uid;

        /* Load feedback (only fetch own feedback if not author) */
        var fbCollection = firebase.firestore().collection('feedback').where('journal', '==', this.details.id)
        if(!this.isAuthor) fbCollection = fbCollection.where('author', '==', user.uid)
        fbCollection.get().then(fbSnapshot => {
          fbSnapshot.docs.forEach(fbDoc => {
            this.details.feedback.push({ id: fbDoc.id, ...fbDoc.data() })
          })
        });

      } else { this.$router.push('/') }
    }).catch((error) => { this.$router.push('/');   console.log(error) /* Debug: Only for development. Remove in production */ });

  },
  methods: {
    createFeedback() {
      const user = firebase.auth().currentUser;
      this.states.loadingFeedback = true;

      const feedback = {
        author: user.uid,
        journal: this.details.id,
        text: this.feedbackCache
      }

      firebase.firestore().collection('feedback').add(feedback).then(docRef => {
        this.details.feedback.push({id: docRef.id, ...feedback})
        this.states.loadingFeedback = false
        this.states.dialogFeedback = false
        this.feedbackCache = ""
      }).catch(error => {
        this.states.loadingFeedback = false
      })
    },
    deleteJournal() {
      firebase.firestore().collection('journals').doc(this.details.id).delete().then(() =>  {
        this.$router.push('/')
      }).catch((error) => {
        console.log(error)
        this.states.dialogDelete = false
      })
    },
    translateDate(timestamp) {
      var date = new Date(timestamp.seconds*1000)
      var days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`
    },
    toggleEditMode() {
      if(this.isAuthor) {
        if(this.editMode && this.hasChanges()) {
          this.states.loadingSave = true

          firebase.firestore().collection('journals').doc(this.details.id).update({
            reflection: this.details.reflection,
            notes: this.details.notes
          }).then(() => {
            this.states.loadingSave = false
            this.editMode = !this.editMode
          }).catch(error => {
            this.states.loadingSave = false
          });

        } else {
          if(!this.editMode) this.detailsOrigin = {...this.details}
          this.editMode = !this.editMode
        }
      }
    },
    hasChanges() {
      return this.details.reflection != this.detailsOrigin.reflection ||
        this.details.notes != this.detailsOrigin.notes
    }
  }
}
</script>