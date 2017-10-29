const piWifi = require('pi-wifi')

const wifi = {
  connect: (ssid, password) => new Promise((resolve, reject) => {
    piWifi.connect(ssid, password, (err) => {
      if (err) return reject(err)
      return resolve({ result: 'success' })
    })
  }),

  disconnect: () => new Promise((resolve, reject) => {
    piWifi.disconnect((err) => {
      if (err) return reject(err)
      return resolve({ result: 'success' })
    })
  }),

  scan: () => new Promise((resolve, reject) => {
    piWifi.scan((err, networks) => {
      if (err) return reject(err)
      return resolve(networks)
    })
  }),

  status: (interface = 'wlan0') => new Promise((resolve, reject) => {
    piWifi.status(interface, (err, status) => {
      if (err) return reject(err)
      return resolve(status)
    })
  })
}

module.exports = wifi
