<template>
  <v-card class="grey lighten-5 border mb-1" style="border-radius: 0px; border: none;">
    <v-card-text class="sensorBox border pt-1" style="padding: 0px">
      <v-layout row wrap class="border" style="padding: 0px">
        <v-flex xs12 class="border text-xs-left pl-4 headline">
          <v-layout row wrap class="border">
            <v-flex xs6 class="border">{{sensorType}}</v-flex>
            <v-flex xs6>
              <v-layout row wrap>
                <v-flex xs4 v-for="x in 2" :key="x" class="border icon">
                </v-flex>
                <v-flex xs4>
                  <v-icon :class="{'pink--text': !good, 'light-blue--text': good}">
                    radio_button_checked
                  </v-icon>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 class="border display-1 grey--text text-xs-center">
            <i-odometer class="iOdometer" :value="data"></i-odometer>
            <span v-html="unit" style="position:relative; top: 4px;"></span>
        </v-flex>
        <v-flex xs12 class="border">
          <div class="infoBox pa-1 grey lighten-3 border">
            <v-layout row wrap class="border innerInfoBox" :class="{'pink--text': !good, 'light-blue--text': good}">
              <v-flex xs12 class="title text-xs-left border pl-4" style="font-weight: 600">Ideal</v-flex>
              <v-flex xs12 class="headline text-xs-center border" style="font-weight: 600">
                  <i-odometer class="iOdometer" :value="ideal[0]"></i-odometer>
                  -
                  <i-odometer class="iOdometer" :value="ideal[1]"></i-odometer>
                  <span v-html="unit" style="position:relative; top: 2px;"></span>
              </v-flex>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import IOdometer from 'vue-odometer'

export default {
  name: 'sensorBox',
  components: {
    IOdometer
  },
  props: {
    sensorType: {
      type: String,
      default: 'Loading'
    },
    good: {
      type: Boolean,
      default: true
    },
    data: {
      type: Number,
      default: '(%|&#8451;|&#8457;)'
    },
    ideal: {
      type: Array,
      default: [0, 0]
    }
  },
  data () {
    return {
      msg: 'Template or Testing page'
    }
  },
  created () {
    // console.log(this._.random(20))
  },
  watch: {
  },
  computed: {
    unit () {
      if (this.sensorType === 'Temperature') return '&#8451;'
      return '%'
    }
  },
  methods: {
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="sass">
.border
  // border: 1px dashed grey

.infoBox
  cursor: pointer
  height: 60px
  margin: 0 auto
  width: 98.5%
  .innerInfoBox
    transition: all 0.1s ease

.icon
  padding-left: 0
  height: 40px
  transition: all 0.1s ease
  cursor: pointer
  &:hover
    color: #bEbEbE

.nodeId
  cursor: pointer
  font-weight: 600
  color: #bEbEbE

.sensorBox
  cursor: pointer
  height: 152px
  box-shadow: 0px 1px 1px #BBBBBB
  transition: all 0.5s ease-in
  &:hover
    box-shadow: 2px 2px 3px #888888

</style>
