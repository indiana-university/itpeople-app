var fetch = require('node-fetch')

var Storage = require('dom-storage')
localStorage = new Storage('./localStorage.json', { strict: false, ws: '  ' })

process.env = Object.assign(process.env, {
  REACT_APP_API_URL: 'http://localhost:3001'
})
