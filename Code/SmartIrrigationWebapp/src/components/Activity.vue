<template>
    <v-card class="elevation-10 px-5 py-3">
        <v-card-title class="title">
            Activity
        </v-card-title>
        <v-card-text>
            <!-- <transition name="expand" v-for="node in getUserData.nodes" :key="node.id">
                <div class="elevation-1 border ma-2" v-if="node.name.match(matchRegExpr)">
                    {{node.name}}
                </div>
            </transition> -->
            <v-alert
                v-for="(el, i) in notificationProvision()"
                :key="i"
                :class="el.type"
                :value="el.value"
                transition="scale-transition">
                <v-layout row wrap>
                    <v-flex xs11>{{el.content}}</v-flex>
                    <v-flex xs1>
                        <v-btn icon style="padding: 0px; margin: 0px;" @click.native="decrement_counter(el)">
                            <v-icon dark>backspace</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-alert>
        </v-card-text>
    </v-card>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'test',
  data () {
    return {
      msg: 'Template or Testing page',
      x: true,
    }
  },
  created () {
    // console.log(this._.random(20))
  },
  computed: {
    ...mapGetters([
      'getUserData',
      'getSelectedNode',
      'getNotificationCount',
      'getNotifications'
    ]),
    matchRegExpr () {
      return new RegExp(this.input, 'i')
    //   return this.getUserData.nodes.filter(o => o.name.match(re))
    }
  },
  methods: {
    ...mapActions([
      'setAsyncNotificationCount'
      ]),
    test () {
      console.log('abc')
    },
    // called in vue/html markup at top of activity
    // called when user goes to activity
    // decide which notifications to provide
    notificationProvision () {
      if (this.getNotificationCount > 0) return this.getNotifications
      return [{
        type: 'success',
        value: true,
        content: 'You have gone through all your notifications!'
      }]
    },
    // method called in vue/html markup at the top
    // called when a notification has its delete-button pressed
    decrement_counter (el) {
      // if the notification is a warning and not an error
      if (el.type == 'warning') {
        this.setAsyncNotificationCount(this.getNotificationCount - 1)
        el.value = false;
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="sass">
.border
  // border: 1px dashed grey

.expand-enter
    max-height: 0px
    padding-top: 0px
    padding-bottom: 0px
    overflow: hidden

.expand-enter-active
    transition: all 2s cubic-bezier(.97,.21,.84,.38)
    overflow: hidden

.expand-enter-to
    max-height: 2000px
    overflow: hidden

.expand-leave
    max-height: 2000px
    overflow: hidden

.expand-leave-active
    transition: all 0.5s cubic-bezier(0, 1, 0, 1)
    overflow: hidden

.expand-leave-to
    padding-top: 0px
    padding-bottom: 0px
    max-height: 0px
    overflow: hidden

</style>
