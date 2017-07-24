import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../components/Dashboard.vue'
import Setting from '../components/Setting.vue'
import Activity from '../components/Activity.vue'
import Search from '../components/Search.vue'
import Loading from '../components/Loading.vue'
// import Template from '../components/EwingTemplate.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/dashboard'
  }, {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  }, {
    path: '/setting',
    name: 'setting',
    component: Setting
  }, {
    path: '/activity',
    name: 'activity',
    component: Activity
  }, {
    path: '/search',
    name: 'search',
    component: Search
  }, {
    path: '/loading',
    name: 'loading',
    component: Loading
  }, {
    path: '*',
    redirect: '/dashboard'
  }]
})
