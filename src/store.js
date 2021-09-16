import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import firebase from 'firebase/app';
import 'firebase/auth';

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

export default new Vuex.Store({
  state: {
    journals: [],
    user: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_JOURNALS(state, journals) {
      state.journals = journals;
    },
    ADD_JOURNAL(state, journal) {
      state.journals.push(journal);
    }
  },
  actions: {
    signin(context, { email, password }) {
      return new Promise(async (resolve, reject) => {
        try {
          const user = await firebase.auth().signInWithEmailAndPassword(email, password);
          context.commit('SET_USER', user);
          resolve(user);
        } catch(error) {
          reject(error);
        }
      });
    },
    signout(context) {
      firebase.auth().signOut();
    }
  },
  getters: {
    isLoggedIn(state) {
      return state.user != null;
    },
    journalById(state, journalId) {
      return state.journals.find(journal => journal.id === journalId);
    }
  }
})
