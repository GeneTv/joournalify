import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import './registerServiceWorker'

Vue.config.productionTip = false
firebase.initializeApp({
  apiKey: "AIzaSyDNqRcq9ONg96KMI-EQvqniyeFP_-f_EFg",
  authDomain: "joournalify.firebaseapp.com",
  databaseURL: "https://joournalify.firebaseio.com",
  projectId: "joournalify",
  storageBucket: "joournalify.appspot.com",
  messagingSenderId: "380989249243",
  appId: "1:380989249243:web:acdeb4c7a26525f8ee1efe",
  measurementId: "G-70DPWCE8V3"
});

let vueApp;

firebase.auth().onAuthStateChanged(user => {
  if(!vueApp) {
    vueApp = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})
