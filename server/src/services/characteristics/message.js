const bleno = require('bleno')
const util = require('util')

const lightService = require('../light')
const wifiService = require('../wifi')

const BlenoCharacteristic = bleno.Characteristic

const MessageCharacteristic = function() {
  // Each characteristic can have read, write, read/write, none authorization rules
  MessageCharacteristic.super_.call(this, {
    uuid: 'ff51b30e-d7e2-4d93-8842-a7c4a57dfb10',
    properties: ['read', 'write'],
  })

  this._value = new Buffer(0)
  this._updateValueCallback = () => {}
}

function onReadRequest (offset, callback) {
  console.log('MessageCharacteristic - onReadRequest: value = ' + this._value.toString('hex'))

  callback(this.RESULT_SUCCESS, this._value)
}

function onWriteRequest (data, offset, withoutResponse, callback) {
  this._value = data

  console.log('MessageCharacteristic - onWriteRequest: value = ' + this._value)
  const message = JSON.parse(this._value)

  if (this._value) {
    const { type } = message

    switch (type) {
      case 'COLOR':
        lightService.setColor(message.color)
        break
      case 'WIFI':
        wifiService
          .connect(message.ssid, message.password)
          .catch(console.error)
        break
      default:
        const serviceMethod = lightService[String(type).toLowerCase()]
        if (!serviceMethod) break

        serviceMethod()
    }

    this._updateValueCallback(this._value)
  }

  callback(this.RESULT_SUCCESS)
  // callback(this.RESULT_SUCCESS, { data })
}

MessageCharacteristic.prototype.onWriteRequest = onWriteRequest
MessageCharacteristic.prototype.onReadRequest = onReadRequest

util.inherits(MessageCharacteristic, BlenoCharacteristic)

module.exports = MessageCharacteristic
