<template>
    <v-card class="elevation-10 px-5 py-4" style="min-height: 87vh;">
        <v-speed-dial v-model="fab"
          direction="right"
          absolute
          :hover="false"
          :transition="'slide-y-reverse-transition'">
          <v-btn slot="activator" primary dark fab hover v-model="fab">
            <v-icon>settings</v-icon>
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn fab dark small @click.native.stop="actionDialog = true; setActionValue()" class="blue darken-2">
              <v-icon fa>pencil-square-o</v-icon>
          </v-btn>
          <v-btn fab dark small @click.native.stop="settingDialog = true" class="green darken-2">
              <v-icon>important_devices</v-icon>
          </v-btn>
        </v-speed-dial>
        <v-card-title class="border">
            <v-dialog v-model="settingDialog" lazy absolute width="400">
                <!-- <v-btn primary dark icon slot="activator" class="border">
                    <v-icon>settings</v-icon>
                </v-btn> -->
                <v-card>
                  <v-card-title>
                    <div class="headline">Display Filter</div>
                  </v-card-title>
                  <v-card-text>
                      <v-layout row wrap>
                        <v-flex xs12 md6 v-for="(el, i) in headers" :key="i">
                            <v-switch :label="el.text"
                                v-model="showControl"
                                color="red darken-3"
                                :value="el.text"
                                hide-details></v-switch>
                        </v-flex>
                      </v-layout>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="green--text darken-1" flat="flat" @click.native="settingDialog = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="actionDialog" lazy absolute width="400" scrollable>
                <!-- <v-btn primary dark icon slot="activator" @click.native="setActionValue" class="border">
                    <v-icon>important_devices</v-icon>
                </v-btn> -->
                <v-card>
                  <v-card-title>
                    <div class="headline">Actions</div>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text style="max-height: 500px; overflow: hidden; overflow-y: scroll;">
                      <v-layout row wrap>
                        <v-flex xs12 md6>
                            <v-text-field name="Name" label="Name"
                                v-model="actionValue.name"
                                :disabled="(selected.length > 1 || selected.length === 0)"
                                :rules="[rules.required]"
                                ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-text-field name="Ip Address" label="Ip Address"
                                v-model="actionValue.ipaddress"
                                :disabled="(selected.length > 1 || selected.length === 0)"
                                :rules="[rules.required]"
                                ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-text-field name="Min Humidity" label="Min Humidity"
                                v-model="actionValue.humidityMin" suffix="% "
                                :disabled="(selected.length === 0)"
                                :rules="[rules.required, rules.humidity]"
                                ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-text-field name="Max Humidity" label="Max Humidity"
                                v-model="actionValue.humidityMax" suffix="% "
                                :disabled="(selected.length === 0)"
                                :rules="[rules.required, rules.humidity]"
                                ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-text-field name="Min Light" label="Min Light"
                                v-model="actionValue.sunlightMin" suffix="% "
                                :disabled="(selected.length === 0)"
                                :rules="[rules.required, rules.sunlight]"
                                ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-text-field name="Max Light" label="Max Light"
                                v-model="actionValue.sunlightMax" suffix="% "
                                :disabled="(selected.length === 0)"
                                :rules="[rules.required, rules.sunlight]"
                                ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-text-field name="Min Temperature" label="Min Temperature"
                                v-model="actionValue.tempMin" suffix="°C"
                                :disabled="(selected.length === 0)"
                                :rules="[rules.required, rules.temperature]"
                                ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-text-field name="Max Temperature" label="Max Temperature"
                                v-model="actionValue.tempMax" suffix="°C"
                                :disabled="(selected.length === 0)"
                                :rules="[rules.required, rules.temperature]"
                                ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-text-field name="Min Moisture" label="Min Moisture"
                                v-model="actionValue.moistureMin" suffix="% "
                                :disabled="(selected.length === 0)"
                                :rules="[rules.required, rules.moisture]"
                                ></v-text-field>
                        </v-flex>
                        <v-flex xs12 md6>
                            <v-text-field name="Max Moisture" label="Max Moisture"
                                v-model="actionValue.moistureMax" suffix="% "
                                :disabled="(selected.length === 0)"
                                :rules="[rules.required, rules.moisture]"
                                ></v-text-field>
                        </v-flex>
                      </v-layout>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="blue--text darken-1" flat="flat" @click.native="actionDialog = false">Send</v-btn>
                    <v-btn class="green--text darken-1" flat="flat" @click.native="actionDialog = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
            </v-dialog>
          <v-spacer></v-spacer>
          <v-text-field
            class="border"
            append-icon="search"
            label="Search"
            hide-details
            v-model="search"
          ></v-text-field>
        </v-card-title>

        <v-data-table
            v-model="selected"
            :headers="headers"
            :items="getUserData.nodes"
            :search="search"
            select-all
            :loading="isLoading"
            v-bind:pagination.sync="pagination"
            selected-key="name"
            class="elevation-1">
            <template slot="headers" scope="props">
              <tr>
                <th>
                  <v-checkbox
                    primary
                    hide-details
                    @click.native="toggleAll"
                    :input-value="props.all"
                    :indeterminate="props.indeterminate"
                    style="transform: translate(0px, 15px);"
                  ></v-checkbox>
                </th>
                <th v-for="(header, i) in props.headers" :key="i"
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                  @click="changeSort(header.value)" v-if="arrayContains(showControl, header.text)">
                  <v-icon>arrow_upward</v-icon>
                  {{ header.text }}
                </th>
              </tr>
            </template>
            <template slot="items" scope="props">
            <tr :active="props.selected" @click="props.selected = !props.selected">
              <td>
                <v-checkbox
                  primary
                  hide-details
                  :input-value="props.selected"
                  style="transform: translate(0px, 15px);"
                  ></v-checkbox>
              </td>
              <td class="text-xs-center" v-for="(value, key) in props.item" nowrap v-if="arrayContains(showControl, key)">
                  {{ value }}
              </td>
            </tr>
            </template>
        </v-data-table>
        <!-- {{showControl}}
        {{selected}} -->
    </v-card>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'test',
  data () {
    return {
      msg: 'Template or Testing page',
      fab: true,
      search: '',
      pagination: {sortBy: 'name'},
      selected: [],
      showControl: [
        'name', 'id'
      ],
      settingDialog: false,
      actionDialog: false,
      headers: [
        { text: 'Header', align: 'left', value: 'name' }
      ],
      items: [],
      actionValue: {
        'ipaddress': '',
        'name': '',
        'tempMin': 0,
        'tempMax': 0,
        'humidityMin': 0,
        'humidityMax': 0,
        'moistureMin': 0,
        'moistureMax': 0,
        'sunlightMin': 0,
        'sunlightMax': 0
      },
      rules: {
        required: (value) => {
          if (value === '') return 'Required.'
          else return true
        },
        humidity: (value) => {
          const v = this.actionValue
          if (parseInt(v.humidityMin) < 0 || parseInt(v.humidityMax) < 0 || parseInt(v.humidityMin) > 100 || parseInt(v.humidityMax) > 100) return 'Invalid Value.'
          else if (parseInt(v.humidityMin) > parseInt(v.humidityMax)) return 'Min > Max.'
          else return true
        },
        sunlight: (value) => {
          const v = this.actionValue
          if (parseInt(v.sunlightMin) < 0 || parseInt(v.sunlightMax) < 0 || parseInt(v.sunlightMin) > 100 || parseInt(v.sunlightMax) > 100) return 'Invalid Value.'
          else if (parseInt(v.sunlightMin) > parseInt(v.sunlightMax)) return 'Min > Max.'
          else return true
        },
        moisture: (value) => {
          const v = this.actionValue
          if (parseInt(v.moistureMin) < 0 || parseInt(v.moistureMax) < 0 || parseInt(v.moistureMin) > 100 || parseInt(v.moistureMax) > 100) return 'Invalid Value.'
          else if (parseInt(v.moistureMin) > parseInt(v.moistureMax)) return 'Min > Max.'
          else return true
        },
        temperature: (value) => {
          const v = this.actionValue
          if (parseInt(v.tempMin) < 0 || parseInt(v.tempMax) < 0 || parseInt(v.tempMin) > 100 || parseInt(v.tempMax) > 100) return 'Invalid Value.'
          else if (parseInt(v.tempMin) > parseInt(v.tempMax)) return 'Min > Max.'
          else return true
        }
      }
    }
  },
  created () {
    // console.log(this._.random(20))
    this.setHeader()
  },
  watch: {
    getUserData () {
      this.setHeader()
    }
  },
  computed: {
    ...mapGetters([
      'getUserData',
      'getSelectedNode'
    ]),
    isLoading () {
      return this.getUserData.nodes[0].id === 0
    }
  },
  methods: {
    matchRegExpr () {
      const re = new RegExp(this.search, 'i')
      const list = this.getUserData.nodes.filter((obj) => {
        console.log(obj)
        for (let key of Object.keys(obj)) {
          console.log(obj[key])
          if (obj[key].toString().match(re)) return true
        }
        return false
      })
      return list
    },
    setHeader () {
      this.headers = []
      const list = Object.keys(this.getUserData.nodes[0])
                              .map(o => { return {text: o, value: o} })
      for (let li of list) {
        if (li.text !== 'active') this.headers.push(li)
      }
    },
    setActionValue () {
      if (this.selected.length > 1) {
        this.actionValue.name = 'Multiple Nodes Selected'
        this.actionValue.ipaddress = 'Multiple Nodes Selected'
      } else if (this.selected.length === 0) {
        for (let key of Object.keys(this.actionValue)) {
          this.actionValue[key] = '---'
        }
        this.actionValue.name = 'No Node Selected'
      } else {
        for (let key of Object.keys(this.actionValue)) {
          this.actionValue[key] = this.selected[0][key]
        }
      }
    },
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.matchRegExpr().slice()
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    arrayContains (list, el) {
      for (let l of list) {
        if (JSON.stringify(l) === JSON.stringify(el)) { return true }
      }
      return false
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style lang="sass">
.border
    // border: 1px dashed grey

// .speed-dial
//   position: absolute
//
// .btn--floating
//   position: relative

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
