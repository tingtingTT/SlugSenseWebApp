import axios from 'axios/dist/axios.min'
import _url from '../config/url'

// function that POSTs up to the server and get user data, along with most
// recent notifications
// in the future, SlugSense intends to store notifications & counts on server,
// instead of calculating them in the webapp
export const setAsyncUserData = ({ commit }, payload) => {
  // using the hardcode token here, Plz change to use the one store in local storage
  const urlUserData = `${_url.heroku.env()}users/getuser`
  const urlLatestReadings = `${_url.heroku.env()}nodes/latest_readings/all`
  const user_token = localStorage.getItem('token')

  function getUserData() {
    return axios.post(urlUserData, {
      api_token: user_token
    })
  }
  function getLatestReadings() {
    return axios.post(urlLatestReadings, {
      api_token: user_token
    })
  }

  // concurrently POST to server to get userdata & most recent server variable
  axios.all([getLatestReadings(), getUserData()])
    .then(axios.spread((latestResponse, userDataResponse) => {
      // save userData package
      commit('setUserData', userDataResponse.data)

      var latest = latestResponse.data
      var limits = userDataResponse.data.nodes
      // array carries notifications
      var notificationList = new Array()
      var myRX = /([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2})(:[0-9|:]{5}).*/i

      for (var node = 0; node < latest.length; node++) {
        var match = myRX.exec(latest[node].updatedAt)
        var timeStamp = latest[node].updatedAt
        if (match) {
            var timeStamp = match[4] % 12 + match[5] + ((match[4] - 12) > 0?'PM':'AM') 
              + ', on ' + match[2] + '/' + match[3] + '/' + match[1]
          }
        if (latest[node].humidity > limits[node].humidityMax) {
          notificationList.push({
            type: 'warning',
            value: 'true',
            content: 'Humidity is ' + (latest[node].humidity - limits[node].humidityMax)
              + " above acceptable limits at " + limits[node].name + " as of " 
              + timeStamp + "."
             })
        }
        if (latest[node].temperature > limits[node].tempMax) {
          notificationList.push({
            type: 'warning',
            value: 'true',
            content: 'Temperature is ' + (latest[node].temperature - limits[node].tempMax) 
              + " above acceptable limits at " > limits[node].name + " as of " 
              + timeStamp + "."
             })
        }
        if (latest[node].sunlight > limits[node].sunlightMax) {
          notificationList.push({
            type: 'warning',
            value: 'true',
            content: 'Sunlight is ' + (latest[node].sunlight - limits[node].sunlightMax)
              + " above acceptable limits at " + limits[node].name + " as of " 
              + timeStamp + "."
             });
        }
        if (latest[node].moisture > limits[node].moistureMax) {
          notificationList.push({
            type: 'warning',
            value: 'true',
            content: 'Moisture is ' + (latest[node].moisture - limits[node].moistureMax)
              + " above acceptable limits at " + limits[node].name + " as of " 
              + timeStamp + "."
             })
        }
        if (latest[node].sunlight < limits[node].sunlightMin) {
          notificationList.push({
            type: 'warning',
            value: 'true',
            content: 'Sunlight is ' + (limits[node].sunlightMin - latest[node].sunlight)
              + " below acceptable limits at " + limits[node].name + " as of " 
              + timeStamp + "."
             })
        }
        if (latest[node].temperature < limits[node].tempMin) {
          notificationList.push({
            type: 'warning',
            value: 'true',
            content: 'Temperature is ' + (limits[node].tempMin - latest[node].temperature)
              + " below acceptable limits at " + limits[node].name + " as of " 
              + timeStamp + "."
             })
        }
        if (latest[node].humidity < limits[node].humidityMin) {
          notificationList.push({
            type: 'warning',
            value: 'true',
            content: 'Humidity is ' + (limits[node].humidityMin - latest[node].humidity)
              + " below acceptable limits at " + limits[node].name + " as of " 
              + timeStamp + "."
             })
        }
        if (latest[node].moisture < limits[node].moistureMin) {
          notificationList.push({
            type: 'warning',
            value: 'true',
            content: 'Moisture is ' + (limits[node].moistureMin - latest[node].moisture)
              + " below acceptable limits at " + limits[node].name + " as of " 
              + timeStamp + "."
             })
        }
      }
      // commit number of notifications, along with the array of notifications we generate
      commit('setNotificationCount', notificationList.length)
      commit('setNotifications', notificationList)
      }
    ) 
  ).catch((err) => {
    console.log(err)
    var notificationList = [{
      type: 'error',
      value: true,
      content: 'Failure to POST to database API.'
    }]
    commit('setNotificationCount', '!')
    commit('setNotifications', notificationList)
  })
}

export const setAsyncSelectedNode = ({ commit }, payload) => {
  commit('setSelectedNode', payload);
}

export const setAsyncNotificationCount = ({ commit }, payload) => {
  commit('setNotificationCount', payload);
}
