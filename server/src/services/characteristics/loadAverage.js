const bleno = require('bleno')
const os = require('os')
const util = require('util')

const BlenoCharacteristic = bleno.Characteristic

const LoadAverageCharacteristic = function() {
  LoadAverageCharacteristic.super_.call(this, {
    uuid: 'ff51b30e-d7e2-4d93-8842-a7c4a57dfb10',
    properties: ['read'],
  })

  this._value = new Buffer(0)
}

LoadAverageCharacteristic.prototype.onReadRequest = function(offset, callback) {
  if(!offset) {
    const loadAverage = os.loadavg().map(function(currentValue, index, array){
      return currentValue.toFixed(3)
    })

    this._value = new Buffer(JSON.stringify({
      'oneMin' : loadAverage[0],
      'fiveMin': loadAverage[1],
      'fifteenMin': loadAverage[2]
    }))
  }

  console.log('LoadAverageCharacteristic - onReadRequest: value = ' +
    this._value.slice(offset, offset + bleno.mtu).toString()
  )

  callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length))
}

util.inherits(LoadAverageCharacteristic, BlenoCharacteristic)

module.exports = LoadAverageCharacteristic
