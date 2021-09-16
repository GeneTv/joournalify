/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

initializeApp({
  apiKey: "AIzaSyDNqRcq9ONg96KMI-EQvqniyeFP_-f_EFg",
  authDomain: "joournalify.firebaseapp.com",
  databaseURL: "https://joournalify.firebaseio.com",
  projectId: "joournalify",
  storageBucket: "joournalify.appspot.com",
  messagingSenderId: "380989249243",
  appId: "1:380989249243:web:acdeb4c7a26525f8ee1efe",
  measurementId: "G-70DPWCE8V3"
});


const auth = getAuth();
const database = getFirestore();
const store = new Vuex.Store({
  state: {
    isReady: false,
    user: null,
    journals: []
  },
  mutations: {
    SET_READY(state, readyState) {
      state.isReady = readyState;
    },
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
          const user = await signInWithEmailAndPassword(auth, email, password);
          context.commit('SET_USER', user);
          resolve(user);
        } catch(error) {
          reject(error);
        }
      });
    },
    signout() {
      signOut(auth);
    }
  },
  getters: {
    isAuthenticated(state) {
      return state.user != null;
    },
    journalById(state, journalId) {
      return state.journals.find(journal => journal.id === journalId);
    }
  }
});

onAuthStateChanged(auth, user => {
  console.debug('[store]    auth state changed', user);
  store.commit('SET_USER', user);
  if(!store.state.isReady) store.commit('SET_READY', true);
})

export default store;