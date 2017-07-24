export const setUserData = (state, payload) => {
  console.log('setUserData')
  state.userData = payload
  try {
    state.notificationCount = 0
    state.selectedNode = payload.nodes[0] // Using the first node as default
    payload.nodes[0].active = true
  } catch (err) {
    console.log(err)
  }
}

export const setSelectedNode = (state, payload) => {
  console.log('setSelectedNode')
  state.selectedNode = payload // Using the first node as default
}

export const setNotificationCount = (state, payload) => {
  state.notificationCount = payload
}

export const setNotifications = (state, payload) => {
  state.notifications = payload
}