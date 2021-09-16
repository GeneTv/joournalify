import Vue from 'vue'
import VueRouter from 'vue-router'
import securityService from '@/services/security'
Vue.use(VueRouter);

import JournalDetails from '@/views/JournalDetails.vue'
import JournalOverview from '@/views/JournalOverview.vue'
import Login from '@/views/Login.vue'


const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'JournalOverview',
    component: JournalOverview,
    meta: { accessRestricted: true }
  }, {
    path: '/journal/:id',
    name: 'JournalDetails',
    component: JournalDetails,
    meta: { accessRestricted: true }
  }, {
    path: '*',
    redirect: '/',
    meta: { accessRestricted: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(securityService);
export default router;
