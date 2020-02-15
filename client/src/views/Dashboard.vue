<template>
  <v-content>


    <v-container class="my-5">
      <v-card v-for="entry in entries" :key="entry.id"  router :to="`details/${entry.id}`">
        <v-layout row wrap :class="`pa-3 project`">

          <v-flex xs12 md6>
            <div class="caption grey--text">Title</div>
            <div>{{ entry.title }}</div>
          </v-flex>
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Date</div>
            <div>{{ entry.date }}</div>
          </v-flex>
          
          <v-flex xs6 sm4 md2>
            <div class="caption grey--text">Tasks</div>

            <div v-for="task in entry.tasks" :key="task">{{ task }}</div>
          </v-flex>

        </v-layout>
      </v-card>
    </v-container>

  </v-content>
</template>


<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      entries: [

        {
          id: "Yasvbkw7rMZmtByuB68o",
          date: "2020-02-20T00-00-00",
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
        
      ]
    }
  }
}
</script>