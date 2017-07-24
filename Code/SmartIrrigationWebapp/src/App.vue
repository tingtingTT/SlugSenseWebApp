<template>
  <v-app id="app" standalone>
    <v-navigation-drawer persistent dark :mini-variant.sync="mini" v-model="drawer" overflow>
      <v-list>
          <v-list-tile avatar tag="div">
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{getUserData.username}}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon @click.native.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-group v-for="(item, i) in sideBarItems" :key="i">
          <v-list-tile slot="item" :to="{name: item.path}">
            <v-list-tile-action>
              <v-icon class="text--lighten-1" :class="{'teal--text': item.items}">{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="text--lighten-2" :class="{'teal--text': item.items}">
                  {{ item.title }}
                  <div class="mybadge teal" v-if="item.items"><span style="position: relative; left: 1px;">{{item.items.length}}</span></div>
              </v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="item.items">
              <v-icon>keyboard_arrow_down</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <div v-if="item.items" class="node_selection_side_bar">
              <v-list-tile v-for="(subItem, j) in item.items" :key="j" :to="{name: 'dashboard'}"
                          @click.native="setAsyncSelectedNode(subItem); selected(j)">
                <!-- <v-list-tile-action>
                  <v-icon class="text--lighten-2" :class="{'teal--text': subItem.active, 'white--text': !subItem.active}">border_outer</v-icon>
                </v-list-tile-action> -->
                <v-list-tile-content>
                  <v-list-tile-title class="text--lighten-2" :class="{'teal--text': subItem.active, 'white--text': !subItem.active}">{{ subItem.name }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
          </div>
        </v-list-group>
        <v-divider></v-divider>
          <v-list-tile @click.native="logout()">
            <v-list-tile-content>
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed class="primary" dark>
      <v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
          <span>{{getSelectedNode.name}}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn> -->
      <v-btn icon @click.native="activity()">
        <v-icon v-badge="{ value: getNotificationCount, overlap: true, visible: (getNotificationCount > 0) }" class="red--after">flag</v-icon>
      </v-btn>
      <v-btn icon @click.native="logout()">
          <v-icon fa>sign-out</v-icon>
      </v-btn>
    </v-toolbar>
    <main>
        <v-container fluid id="mainContainer" class="border">
          <v-layout row wrap class="border">
            <v-flex xs12>
              <transition name="slide-fade" mode="out-in">
                <keep-alive>
                  <router-view></router-view>
                </keep-alive>
              </transition>
            </v-flex>
          </v-layout>
        </v-container>
    </main>
  </v-app>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      mini: false,
      drawer: false,
      right: null,
      selectedNode: '',
      sideBarItems: [{
        title: 'Dashboard',
        icon: 'dashboard',
        path: 'dashboard',
        active: true
      }, {
        title: 'Activity',
        icon: 'add_alert',
        path: 'activity',
        active: false
      }, {
        title: 'Search',
        icon: 'search',
        path: 'search',
        active: false
      }, {
        title: 'Nodes',
        icon: 'view_module',
        path: '',
        active: false,
        items: [{name: 'Empty', active: false}]
      }]
    }
  },
  computed: {
    ...mapGetters([
      'getUserData',
      'getSelectedNode',
      'getNotificationCount'
    ])
  },
  methods: {
    ...mapActions([
      'setAsyncSelectedNode'
    ]),
    logout () {
      console.log('logout')
      localStorage.removeItem('token')
      window.location.href = '/'
    },
    activity () {
      // hacky way to go to #/activity
      window.location.href = '/app.html#/activity'
    },
    selected (idx) {
    //   console.log(this.sideBarItems.length)
      let i = 0
      for (let el of this.sideBarItems[this.sideBarItems.length - 1].items) {
        if (i === idx) { el.active = true } else { el.active = false }
        i += 1
      }
    }
  },
  watch: {
    getUserData () {
        // set the node list on the side bar
      this.sideBarItems[this.sideBarItems.length - 1].items = this.getUserData.nodes
    }
  }
}
</script>

<style lang="stylus">
  //This will apply on entire environ
  @import '../node_modules/vuetify/src/stylus/settings/_colors'
  $theme := {
    primary: $indigo.lighten-3
    accent: $indigo.accent-2
    secondary: $grey.darken-4
    info: $blue.lighten-1
    warning: $amber.darken-2
    error: $red.accent-4
    success: $green.lighten-2
  }
  @import '../node_modules/vuetify/src/stylus/main'
</style>

<style lang="sass">
html, body
  margin: 0
  cursor: url('./assets/cursor.png')

.border
  // border: 1px dashed grey

.node_selection_side_bar
    height: 300px
    overflow: hidden
    overflow-y: scroll

.mybadge
    display: inline-block
    padding-right: 1px
    width: 20px
    height: 20px
    border-radius: 50px
    color: #fff
    text-align: center

#app
  font-family: Quicksand, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: #2c3e50

#mainContainer
  // margin-top: $topbar-height
  // margin-left: $leftbar-width
  // width: calc(100% - $leftbar-width)
  padding-top: 0px

.slide-fade-enter
  transform: translateY(1300px)

.slide-fade-enter-active
  transition: all 0.8s ease

.slide-fade-enter-to
  transform: translateY(0px)

.slide-fade-leave
  transform: translateX(0px)

.slide-fade-leave-active
  transition: all 0.2s

.slide-fade-leave-to
  transform: translateX(2500px)
</style>
