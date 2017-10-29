const bleno = require('bleno')
const SystemInformationService = require('./systemInformation')

const systemInformationService = new SystemInformationService()

bleno.on('stateChange', (state) => {
  console.info(`on -> stateChange: ${state}`)

  if (state === 'poweredOn') {
    bleno.startAdvertising(bleno.name, [systemInformationService.uuid])
    return
  }

  bleno.stopAdvertising()
})

bleno.on('advertisingStart', (error) => {
  if (error) {
    console.error(`on -> advertisingStart: error ${error}`)
    return
  }

  console.info('on -> advertisingStart: success')
  bleno.setServices([
    systemInformationService
  ])
})
