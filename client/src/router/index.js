import Vue from 'vue'
import VueRouter from 'vue-router'

import Dashboard from '@/views/Dashboard.vue'
import Details from '@/views/Details.vue'
import Error404 from '@/views/Error404.vue'
import Login from '@/views/Login.vue'
import PasswordReset from '@/views/PasswordReset.vue'
import Profile from '@/views/Profile.vue'

import * as firebase from 'firebase/app';
import 'firebase/auth';

Vue.use(VueRouter)
const routes = [
  {
    path: '/passwordreset/:resetToken',
    name: 'passwordreset',
    component: PasswordReset
  },{
    path: '/login',
    name: 'login',
    component: Login
  },{
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: { accessRestricted: true }
  },{
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { accessRestricted: true }
  },{
    path: '/details/:id',
    name: 'details',
    component: Details,
    meta: { accessRestricted: true }
  },{
    path: '*',
    name: 'error404',
    component: Error404,
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
