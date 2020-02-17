<template>
  <v-content class="mx-4 mb-4">
    <h1 class="headline grey--text mt-5">Dashboard</h1>


    <v-container class="my-5">

      <v-layout row class="mb-3">
        <v-btn text color="success text--grey">
          <v-icon left>add_to_photos</v-icon>
          <span class="caption">Add</span>
        </v-btn>
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
      journals: []
      /*journals: [

        {
          id: "Yasvbkw7rMZmtByuB68o",
          date: 1581883304354,
          tasks: [
            "HTML lernen",
            "CSS lernen"
          ],
          completed: [
            "",
            ""
          ],
          reflection: "Testtext",
          notes: "",
          feedback: [
            { author: "Michael Kellenberger", text: "Hey! Super Sache! Gute Note kommt." }
          ]
        },{
          id: "Yasvbkw7rMZmtByuB689",
          date: 1581583304354,
          tasks: [
            "HTML lernen",
            "CSS lernen"
          ],
          completed: [
            "",
            ""
          ],
          reflection: "Testtext",
          notes: "",
          feedback: [
            { author: "Michael Kellenberger", text: "Hey! Super Sache! Gute Note kommt." }
          ]
        }
        
      ],*/
    }
  },
  created() {
    const user = firebase.auth().currentUser;

    firebase.firestore().collection('journals').where('author', '==', user.uid).get().then((snapshot) => {
      snapshot.docs.forEach(doc => {
        this.journals.push({id: doc.id, date: doc.data().date})
      })
    });
  },
  methods: {
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
.v-card {
  margin-right: 0px;
}
</style>