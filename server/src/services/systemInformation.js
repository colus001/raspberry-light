const bleno = require('bleno')
const util = require('util')

const LoadAverageCharacteristic = require('./characteristics/loadAverage')
const UptimeCharacteristic = require('./characteristics/uptime')
const MemoryCharacteristic = require('./characteristics/memory')
const MessageCharacteristic = require('./characteristics/message')

util.inherits(SystemInformationService, bleno.PrimaryService)

function SystemInformationService() {
  bleno.PrimaryService.call(this, {
    uuid: 'ff51b30e-d7e2-4d93-8842-a7c4a57dfb07',
    characteristics: [
      new LoadAverageCharacteristic(),
      new UptimeCharacteristic(),
      new MemoryCharacteristic(),
      new MessageCharacteristic(),
    ]
  })
}

module.exports = SystemInformationService
