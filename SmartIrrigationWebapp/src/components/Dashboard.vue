<template>
  <v-container fluid class="px-4 py-3">
    <v-layout row wrap class="mb-2">
      <v-flex v-for="(sensor, i) in node" xs12 sm6 lg3 class="border" :key="i">
        <sensor-box :sensorType="sensor.type"
                    :good="checkStatus(sensor.ideal, parseInt(sensor.data))"
                    :data="sensor.data" :ideal="sensor.ideal">
                    </sensor-box>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <v-card height="60px" class="elevation-0">
          <v-card-text>
<!--           Day, week button implemented using vuetify, position to the right. Font using "Roboto". 
 -->            <div class="text-xs-right">
              <v-btn flat v-on:click.native="dayOpt">Day</v-btn>
              <v-btn flat v-on:click.native="weekOpt">Week</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="border mb-4">
      <v-flex xs12>
      <!-- Adjust echart size to fit in users eyes once the graph is loaded -->
          <div id="myEchart" style="width: 100%;height:400px;" onresize="resizeChart()"></div>
           <div class="time">
          </div>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
        <v-flex xs12 md8>
            <v-card class="elevation-5 mb-2">
                <v-card-title class="title">
                    Alert
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-list>
                      <v-list-group v-for="item in nodeSpecificAlerts" :value="item.active" v-bind:key="item.title">
                        <v-list-tile slot="item">
                          <v-list-tile-action>
                            <v-icon>{{ item.action }}</v-icon>
                          </v-list-tile-action>
                          <v-list-tile-content>
                            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <v-icon>keyboard_arrow_down</v-icon>
                          </v-list-tile-action>
                        </v-list-tile>
                        <v-list-tile v-for="subItem in item.items" v-bind:key="subItem.title">
                          <v-list-tile-content>
                            <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                          </v-list-tile-content>
                          <v-list-tile-action>
                            <v-icon>{{ subItem.action }}</v-icon>
                          </v-list-tile-action>
                        </v-list-tile>
                      </v-list-group>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-flex>
        <v-flex xs12 md4>
            <v-card class="elevation-5">
                <v-card-title class="title">
                    Comment
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <v-list>
                      <v-list-tile avatar v-for="item in 5" :key="item">
                      </v-list-tile>
                    </v-list>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import SensorBox from './SensorBox.vue'
import Echarts from 'echarts/lib/echarts'
import ElResize from 'element-resize-event'
import _url from '../config/url'
import {returnDefaultOpt, dayOpt, weekOpt} from './dashboardChartOption'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import axios from 'axios/dist/axios.min'
import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: 'test',
  components: {'sensor-box': SensorBox},
  data () {
    return {
      msg: 'Dashboard',
      node: [],
      chartComponent: null,
      hours: [],
      idStarts: [],
      idEnds: [],
      nodeData: {
        moisture: [],
        light: [],
        temperature: [],
        humidity: [],
        time: []
      },
       weekData: {
        moisture: [],
        light: [],
        temperature: [],
        humidity: [],
        time: []
      },
      chartOpt: {},
      nodeSpecificAlerts: [{
        action: 'local_drink',
        title: 'Moisture',
        items: []
        },
        {
          action: 'wb_sunny',
          title: 'Sunlight',
          items: []
        },
        {
          action: 'copyright',
          title: 'Temperature',
          items: []
        },
        {
          action: 'cloud',
          title: 'Humidity',
          items: []
        }
      ]
    }
  },
  created () {
    this.setNode()
  },
  mounted () {
    this.chartOpt = returnDefaultOpt(this.nodeData)
    this.chartComponent = Echarts.init(document.getElementById('myEchart'))
    this.chartComponent.setOption(this.chartOpt)
    ElResize(document.getElementById('myEchart'), () => {
      this.chartComponent.resize()
    })
  },
  watch: {
    getSelectedNode () {
      this.setNode()
      this.getNodeData()
    }
  },
  computed: {
    ...mapGetters([
      'getUserData',
      'getSelectedNode'
    ])
  },
  methods: {
    ...mapActions([
      'setSelectedNode'
    ]),
    setNode () {
      const selectedNode = this.getSelectedNode
      this.node = [{
        type: 'humidity',
        good: false,
        data: this.getLastDataPoint('humidity'),
        ideal: [selectedNode.humidityMin, selectedNode.humidityMax]
      }, {
        type: 'light',
        good: false,
        data: this.getLastDataPoint('light'),
        ideal: [selectedNode.sunlightMin, selectedNode.sunlightMax]
      }, {
        type: 'temperature',
        good: false,
        data: this.getLastDataPoint('temperature'),
        ideal: [selectedNode.tempMin, selectedNode.tempMax]
      }, {
        type: 'moisture',
        good: false,
        data: this.getLastDataPoint('moisture'),
        ideal: [selectedNode.moistureMin, selectedNode.moistureMax]
      }]
    },

    // DecrementDay takes a data object and an int, and decrements the given date by the given int
    // It also sets the hours, minutes, and seconds to the latest possible time. This is intended to be used to
    // for getting the data of the previous 6 days for the getWeekData function
    decrementDay(inDay, value){
        var retDate = new Date(inDay)
        retDate.setDate(retDate.getDate()-value)
        retDate.setHours(23)
        retDate.setMinutes(59)
        retDate.setSeconds(59)
        retDate.setMilliseconds(999)
        return retDate
    },

    // formattedDay takes a date object and returns a string version of the date
    // formatted in such a way that the API will accept it as the timestamp
    formattedDay(someDay){
        var strMonth = ('00'+(someDay.getMonth()+1)).substr(-2)
        var strDay = ('00'+someDay.getDate()).substr(-2)
        var strHour = ('00'+someDay.getHours()).substr(-2)
        var strMin = ('00'+someDay.getMinutes()).substr(-2)
        var strSec = ('00'+someDay.getSeconds()).substr(-2)
        var strMillisec = ('000'+someDay.getMilliseconds()).substr(-3)
        return (`${someDay.getFullYear()}-${strMonth}-${strDay} ${strHour}:${strMin}:${strSec}.${strMillisec}`)
    },
    // getWeekData takes an input day, and returns the averages of that day
    // and the past 6 days to the weekData object
    getWeekData(inputDay){
        const currDate = new Date(inputDay)
        // The array, promises, will contain all the post requests to get the data
        // for the currrent day and the past 6 days
        var promises = [axios.post(`${_url.heroku.env()}nodes/prev_24h/${this.getSelectedNode.id}`, {
        api_token: localStorage.getItem('token'),
        timestamp: '2017-04-29 23:59:59.999'
      }),
      axios.post(`${_url.heroku.env()}nodes/prev_24h/${this.getSelectedNode.id}`, {
        api_token: localStorage.getItem('token'),
        timestamp: this.formattedDay(this.decrementDay(inputDay, 1))
      }),
      axios.post(`${_url.heroku.env()}nodes/prev_24h/${this.getSelectedNode.id}`, {
        api_token: localStorage.getItem('token'),
        timestamp: this.formattedDay(this.decrementDay(inputDay, 2))
      }),
      axios.post(`${_url.heroku.env()}nodes/prev_24h/${this.getSelectedNode.id}`, {
        api_token: localStorage.getItem('token'),
        timestamp: this.formattedDay(this.decrementDay(inputDay, 3))
      }),
      axios.post(`${_url.heroku.env()}nodes/prev_24h/${this.getSelectedNode.id}`, {
        api_token: localStorage.getItem('token'),
        timestamp: this.formattedDay(this.decrementDay(inputDay, 4))
      }),
      axios.post(`${_url.heroku.env()}nodes/prev_24h/${this.getSelectedNode.id}`, {
        api_token: localStorage.getItem('token'),
        timestamp: this.formattedDay(this.decrementDay(inputDay, 5))
      }),
      axios.post(`${_url.heroku.env()}nodes/prev_24h/${this.getSelectedNode.id}`, {
        api_token: localStorage.getItem('token'),
        timestamp: this.formattedDay(this.decrementDay(inputDay, 6))
      })]
      axios.all(promises)
      .then((results) =>
      {
      this.weekData = {moisture: [], light: [], temperature: [], humidity: [], time: []}
      results.forEach((response)=>{
      let moistureAvg, lightAvg, temperatureAvg, humidityAvg
      let firstData = true
      const deviceData = response.data

      // The following for loop gets the data from all 7 days of the device,
      // averages each day, and then pushes the average from each day to weekData
      for (let data of deviceData) {
        if(data.moisture){
            if (firstData){
                moistureAvg = data.moisture
                lightAvg = data.sunlight
                temperatureAvg = data.temperature
                humidityAvg = data.humidity
                firstData = false
            }
            else{
                moistureAvg = (moistureAvg + data.moisture)/2
                lightAvg = (lightAvg + data.sunlight)/2
                temperatureAvg = (temperatureAvg + data.temperature)/2
                humidityAvg = (humidityAvg + data.humidity)/2
                }
            }
          }
        this.weekData.moisture.push(moistureAvg)
        this.weekData.light.push(lightAvg)
        this.weekData.temperature.push(temperatureAvg)
        this.weekData.humidity.push(humidityAvg)
        this.weekData.time.push(currDate)
          })})
          .catch((error) => {
              console.trace(error)
            })
        },

    // getNodeData gets the data for the current device
    getNodeData () {
       var today = new Date("4/29/2017")
        today.setHours(23)
        today.setMinutes(19)
        this.getWeekData(today)
      // Following is the post request that gets the data for the past 24 hours for the current device
      axios.post(`${_url.heroku.env()}nodes/prev_24h/${this.getSelectedNode.id}`, {
        api_token: localStorage.getItem('token'),
        timestamp: '2017-04-29 23:18:59.000'
      })
        .then((response) => {
          this.nodeData = {moisture: [], light: [], temperature: [], humidity: [], time: []}

          // clean out the 4 arrays of alerts from the previous node
          for (var i = 0; i < this.nodeSpecificAlerts.length; i++) {
            this.nodeSpecificAlerts[i].items = []
          }
          const deviceData = response.data
          for (let data of deviceData) {
            // if null, push anyway (this is what I understand from hunter's explanation)
            if(data.moisture || data.moisture === 0) {
              this.nodeData.moisture.push(data.moisture)
              this.nodeData.light.push(data.sunlight)
              this.nodeData.temperature.push(data.temperature)
              this.nodeData.humidity.push(data.humidity)
              this.nodeData.time.push(data.createdAt)
            }
            
            // regular expressions to parse the timestamps the API provides
            // which is in the format of YYYY-MM-DDTHH:MM:SS.???Z
            // in 24 hour time
            var myRX = /([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2})(:[0-9|:]{5}).*/i
            var match = myRX.exec(data.updatedAt)
            if (match) {
                var timeStamp = match[4] % 12 + match[5] + ((match[4] - 12) > 0?'PM':'AM')
              + ', on ' + match[2] + '/' + match[3] + '/' + match[1]
              }
            else {
                var timeStamp = data.updatedAt
            }

            // a series of if-statements to determine if a node-specific
            // notification needs to be pushed onto our struct that carries
            // the alerts
            if (data.moisture > this.getSelectedNode.moistureMax) {
              this.nodeSpecificAlerts[0].items.push({
                title: (data.moisture - this.getSelectedNode.moistureMax) + 
                  '% above acceptable limits since ' + timeStamp
              })
            }
            if (data.moisture < this.getSelectedNode.moistureMin) {
              this.nodeSpecificAlerts[0].items.push({
                title: (this.getSelectedNode.moistureMin - data.moisture) + 
                  '% below acceptable limits since ' + timeStamp
              })
            }
            if (data.sunlight > this.getSelectedNode.sunlightMax) {
              this.nodeSpecificAlerts[1].items.push({
                title: (data.sunlight - this.getSelectedNode.sunlightMax) + 
                  '% above acceptable limits since ' + timeStamp
              })
            }
            if (data.sunlight < this.getSelectedNode.sunlightMin) {
              this.nodeSpecificAlerts[1].items.push({
                title: (this.getSelectedNode.sunlightMin - data.sunlight) + 
                  '% below acceptable limits since ' + timeStamp
              })
            }
            if (data.temperature > this.getSelectedNode.tempMax) {
              this.nodeSpecificAlerts[2].items.push({
                title: (data.temperature - this.getSelectedNode.tempMax) + 
                  'degrees above acceptable limits since ' + timeStamp
              })
            }
            if (data.temperature < this.getSelectedNode.tempMin) {
              this.nodeSpecificAlerts[2].items.push({
                title: (this.getSelectedNode.tempMin - data.temperature) + 
                  'degrees below acceptable limits since ' + timeStamp
              })
            }
            if (data.humidity > this.getSelectedNode.humidityMax) {
              this.nodeSpecificAlerts[3].items.push({
                title: (data.humidity - this.getSelectedNode.humidityMax) + 
                  '% above acceptable limits since ' + timeStamp
              })
            }
            if (data.humidity < this.getSelectedNode.humidityMin) {
              this.nodeSpecificAlerts[3].items.push({
                title: (this.getSelectedNode.humidityMin - data.humidity) + 
                  '% below acceptable limits since ' + timeStamp
              })
            }
            
          }
          this.setNode()
          // The following line updates the graph with the new nodeData
          this.chartComponent.setOption(returnDefaultOpt(this.nodeData))
        })
        .catch((error) => {
          console.trace(error)
        })
    },
    // The following function gets the last data point in nodeData
    getLastDataPoint(type){
        if (this.nodeData[type].length === 0) return 0
        else return parseInt(this.nodeData[type][this.nodeData[type].length -1])
    },
    parseIdealRangeHtml (range, type) {
      const celsius = '&#8451;'
    // const fahrenheit = '&#8457;'
      const percentage = () => {
        return range[0] + '-' + range[1] + '%'
      }
      const objLiteral = {
        Humidity () { return percentage() },
        Light () { return percentage() },
        Temperature () { return range[0] + '-' + range[1] + celsius },
        Moisture () { return percentage() }
      }
      return objLiteral[type]()
    },
    checkStatus (range, value) {
      if (range[0] <= value && range[1] >= value) return true
      return false
    },
    dayOpt () {
      this.chartComponent.setOption(returnDefaultOpt(this.nodeData))
      this.chartComponent.setOption(dayOpt)
    },
    weekOpt () {
      this.chartComponent.setOption(returnDefaultOpt(this.weekData))
      this.chartComponent.setOption(weekOpt)
    }
  }
}
</script>
<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="sass">
.border
  // border: 1px dashed grey
.topBox
  cursor: pointer
.graph
  height: 300px
  img
    width: 100%
    height: 100%
  // background-image: url('../assets/mockGraph.png')
</style>
<style scoped>
.myRow::after {
    content: "";
    clear: both;
    display: table;
}
[class*="myCol-"] {
  width: 100%;
}
[class*="myCol-"] {
    float: left;
    padding: 5px;
}
@media only screen and (min-width: 576px) {
  /* For tablets: */
  .myCol-xs-1 {width: 10%;}
  .myCol-xs-2 {width: 20%;}
  .myCol-xs-3 {width: 30%;}
  .myCol-xs-4 {width: 40%;}
  .myCol-xs-5 {width: 50%;}
  .myCol-xs-6 {width: 60%;}
  .myCol-xs-7 {width: 70%;}
  .myCol-xs-8 {width: 80%;}
  .myCol-xs-9 {width: 90%;}
  .myCol-xs-10 {width: 100%;}
}
@media only screen and (min-width: 768px) {
  /* For desktop: */
  .myCol-sm-1 {width: 10%;}
  .myCol-sm-2 {width: 20%;}
  .myCol-sm-3 {width: 30%;}
  .myCol-sm-4 {width: 40%;}
  .myCol-sm-5 {width: 50%;}
  .myCol-sm-6 {width: 60%;}
  .myCol-sm-7 {width: 70%;}
  .myCol-sm-8 {width: 80%;}
  .myCol-sm-9 {width: 90%;}
  .myCol-sm-10 {width: 100%;}
}
@media only screen and (min-width: 992px) {
  /* For desktop: */
  .myCol-md-1 {width: 10%;}
  .myCol-md-2 {width: 20%;}
  .myCol-md-3 {width: 30%;}
  .myCol-md-4 {width: 40%;}
  .myCol-md-5 {width: 50%;}
  .myCol-md-6 {width: 60%;}
  .myCol-md-7 {width: 70%;}
  .myCol-md-8 {width: 80%;}
  .myCol-md-9 {width: 90%;}
  .myCol-md-10 {width: 100%;}
}
@media only screen and (min-width: 1200px) {
  /* For desktop: */
  .myCol-lg-1 {width: 10%;}
  .myCol-lg-2 {width: 20%;}
  .myCol-lg-3 {width: 30%;}
  .myCol-lg-4 {width: 40%;}
  .myCol-lg-5 {width: 50%;}
  .myCol-lg-6 {width: 60%;}
  .myCol-lg-7 {width: 70%;}
  .myCol-lg-8 {width: 80%;}
  .myCol-lg-9 {width: 90%;}
  .myCol-lg-10 {width: 100%;}
}
</style>
