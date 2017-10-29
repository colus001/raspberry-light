import { find } from 'lodash'
import { BleManager } from 'react-native-ble-plx'
import base64 from 'base-64'

const DEVICE_UUID = 'ff51b30e-d7e2-4d93-8842-a7c4a57dfb07'

const ble = (() => {
  const manager = new BleManager()

  const state = {
    subscription: null,
    isPoweredOn: false,
    connectedDevice: null,
    writableCharacteristic: null,
  }

  state.subscription = manager.onStateChange((status) => {
    if (status !== 'PoweredOn') {
      state.isPoweredOn = false
      return
    }

    state.isPoweredOn = true
    state.subscription.remove()
  }, true)

  return {
    isInitiated: (callback) => {
      if (state.isPoweredOn) {
        if (callback) callback()
        return
      }

      const interval = setInterval(() => {
        if (!state.isPoweredOn) {
          console.log('waiting')
          return
        }

        if (callback) callback()
        clearInterval(interval)
        return
      }, 500)
    },

    scan: (time = 5) => new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('Timeout')
        manager.stopDeviceScan()
      }, time * 1000)

      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          clearTimeout(timeout)

          console.error(error)
          reject(error)
          return
        }

        const { serviceUUIDs } = device
        if (serviceUUIDs && serviceUUIDs.indexOf(DEVICE_UUID) >= 0) {
          clearTimeout(timeout)

          manager.stopDeviceScan()
          return resolve(device)
        }
      })
    }),

    connect: (device) => {
      if (state.connectedDevice) {
        console.warn('Already connected')
        return
      }

      return device
        .connect()
        .then((device) => {
          state.connectedDevice = device
          console.info('connected')
          return device
        })
    },

    getWritableCharacteristic: () => {
      return state.connectedDevice
        .discoverAllServicesAndCharacteristics()
        .then(async (device) => {
          const services = await device.services()
          const writableCharacteristic = await services.reduce(async (writable, service) => {
            if (writable) return writable

            const characteristics = await service.characteristics()
            return find(characteristics, { isWritableWithResponse: true })
          }, null)

          if (!writableCharacteristic) {
            throw new Error('Writable Characteristic not found')
          }

          state.writableCharacteristic = writableCharacteristic
          return writableCharacteristic
        })
    },

    async send(message) {
      const serialized = typeof message === 'object' ? JSON.stringify(message) : message

      return this
        .getWritableCharacteristic()
        .then(ch => ch.writeWithResponse(base64.encode(serialized)))
    },
  }
})()

export default ble
