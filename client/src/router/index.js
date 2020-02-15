import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'

import * as firebase from 'firebase/app';
import 'firebase/auth';

Vue.use(VueRouter)
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },{
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { accessRestricted: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const accessRestricted = to.matched.some(record => record.meta.accessRestricted);
  const isAuthenticated = firebase.auth().currentUser;

  if(accessRestricted && !isAuthenticated) {
    next('/login')
  } else if(to.name == 'login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
