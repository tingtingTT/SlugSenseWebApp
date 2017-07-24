import env from './env'

const url = {
  heroku: {
    dev: 'https://slugsense.herokuapp.com/api/',
    prod: 'https://slugsense.herokuapp.com/api/',
    env: () => { return url.heroku[env] }
  }
}

export default url
