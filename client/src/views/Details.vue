<template>
  <v-content class="mx-4 mb-4">
    <h1 class="headline grey--text mt-5">Details</h1>
    



  </v-content>
</template>

<script>
export default {
  data() {
    return {
      entry: {
        
      }
    }
  },
  created() {
    /* TODO: Load data from 'this.$route.params.id' */
  },
  methods: {
    translateDate(timestamp) {
      var date = new Date(timestamp)
      var days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`
    }
  }
}
</script>

<style>

</style>