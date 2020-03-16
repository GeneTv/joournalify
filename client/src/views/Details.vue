<template>
  <v-content class="mx-4 mb-4">
    <h1 class="headline grey--text mt-5"><v-app-bar-nav-icon @click.stop="drawer = !drawer" /> Details{{ details.date != null ? ` - ${translateDate(details.date)}` : '' }}</h1>


    <v-navigation-drawer app v-model="drawer" class="success">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title white--text">User's journals</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item v-for="journal in sortedJournals" :key="journal.id" router :to="`/details/${journal.id}`">
          <v-list-item-icon>
            <v-icon class="white--text">calendar_today</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{ translateDate(journal.date) }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>



    <v-container class="my-5">

      <v-layout row class="mb-3">
        <v-btn icon class="gray black--text" @click="$router.push('/')">
          <v-icon>arrow_back_ios</v-icon>
        </v-btn>

        <!-- EDIT MODE BUTTON -->
        <v-btn color="indigo white--text ml-3" v-if="isAuthor" :loading="states.loadingSave" @click="toggleEditMode()">
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

        <!-- SHARE BUTTON -->
        <v-btn text color="gray" class="ml-3" @click="shareJournal()">
          <v-icon left>share</v-icon>
          <span class="caption">Share</span>
        </v-btn>

      </v-layout>

      <v-row>
        <v-col cols="12" md="12">
          <h3 class="mb-2">To do</h3>
          <v-textarea solo label="..." :disabled="!editMode" v-model="details.tasks"></v-textarea>
        </v-col>
        <v-col cols="12" md="12">
          <h3 class="mb-2">Completed</h3>
          <v-textarea solo label="..." :disabled="!editMode" v-model="details.completed"></v-textarea>
        </v-col>
        <v-col cols="12" md="12">
          <h3 class="mb-2">Reflection</h3>
          <v-textarea solo label="..." :disabled="!editMode" v-model="details.reflection"></v-textarea>
        </v-col>
        <v-col cols="12" md="12">
          <h3 class="mb-2">Notes</h3>
          <v-textarea solo label="..." :disabled="!editMode" v-model="details.notes"></v-textarea>
        </v-col>
      </v-row>

      <v-card class="mx-auto mb-5" tile>
        <hr class="amber" color="amber">
        <v-list>
          <v-subheader class="font-weight-bold">Feedback</v-subheader>
          <v-list-item-group color="primary">
            <v-list-item v-for="feedback in details.feedback" :key="feedback.id">
              <v-list-item-content>
                <v-list-item-title>{{ feedback.authorName }}</v-list-item-title>
                <p color="grey" class="">{{ feedback.text }}</p>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>

      <!-- DELETE BUTTON -->
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
      },

      drawer: false,
      journals: []
    }
  },
  mounted() {
    const id = this.$route.params.id
    const user = firebase.auth().currentUser;

    /* Load journal by id */
    firebase.firestore().collection('journals').doc(id).get().then((doc) => {
      if(doc.exists) {
        this.details = { id: doc.id, ...doc.data(), feedback: [] }
        this.isAuthor = this.details.author == user.uid;

        firebase.firestore().collection('journals').where('author', '==', this.details.author).get().then((allSnapshot) => {
          allSnapshot.docs.forEach(allDoc => {
            this.journals.push({ id: allDoc.id, date: allDoc.data().date })
          })
        })

        /* Load feedback (only fetch own feedback if not author) */
        var fbCollection = firebase.firestore().collection('feedback').where('journal', '==', this.details.id)
        if(!this.isAuthor) fbCollection = fbCollection.where('author', '==', user.uid)
        fbCollection.get().then(fbSnapshot => {
          fbSnapshot.docs.forEach(fbDoc => {
            this.details.feedback.push({ id: fbDoc.id, ...fbDoc.data() })
          })
        });

      } else { this.$router.push('/') }
    }).catch((error) => { this.$router.push('/'); });

  },
  updated() {
    
  },
  methods: {
    createFeedback() {
      const user = firebase.auth().currentUser;
      this.states.loadingFeedback = true;

      const feedback = {
        author: user.uid,
        authorName: user.displayName == null ? user.email : user.displayName,
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
            notes: this.details.notes,
            tasks: this.details.tasks,
            completed: this.details.completed
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
        this.details.notes != this.detailsOrigin.notes ||
        this.details.tasks != this.detailsOrigin.tasks ||
        this.details.completed != this.detailsOrigin.completed
    },
    shareJournal() {
      const el = document.createElement('textarea');
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  },
  computed: {
    sortedJournals () {
      return this.journals.sort((a, b) => {
        a.date.seconds < b.date.seconds
      })
    }
  }
}
</script>