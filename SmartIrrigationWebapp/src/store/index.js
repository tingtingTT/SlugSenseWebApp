import Vue from 'vue'
import Vuex from 'vuex'

// Shared Getters Mutations Actions
import * as getters from './getters'
import * as mutations from './mutations'
import * as actions from './actions'

Vue.use(Vuex)
// variable that stores state that multiple components may need to access
export default new Vuex.Store({
  state: {
    userData: {nodes: [{id: 0, name: ''}]},
    selectedNode: '',
    notificationCount: 0,
    notifications: {}
  },
  getters,
  mutations,
  actions
})

console.log('VueX created')
