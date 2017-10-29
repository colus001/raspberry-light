const { assign, range, max } = require('lodash')
const ws281x = require('rpi-ws281x-native')

const DEFAULT_COUNT = 25
const RAINBOW_INTERVAL = 1000 / 30
const BREATH_INTERVAL = 1000 / 50

// Utility
const getColorOffset = ({ red, green, blue }, offset) => ({
  red: (red - offset > 0) ? parseInt(red - offset, 0) : 0,
  green: (green - offset > 0) ? parseInt(green - offset, 0) : 0,
  blue: (blue - offset > 0) ? parseInt(blue - offset, 0) : 0,
})

// eslint-disable-next-line
const rgb2Int = (r, g, b) => ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff)

const wheelColor = (pos) => {
  let position = 255 - pos

  if (position < 85) {
    return rgb2Int(255 - (position * 3), 0, position * 3)
  }

  if (position < 170) {
    position -= 85
    return rgb2Int(0, position * 3, 255 - (position * 3))
  }

  position -= 170
  return rgb2Int(position * 3, 255 - (position * 3), 0)
}

const setPixelData = (count, { red, green, blue }) => range(0, count).map(() => rgb2Int(red, green, blue))

const rotatePixelColor = (pixels, offset) => pixels.map((_, index) => wheelColor((offset + index) % 256))

// Lighter
const lighter = (state) => {
  const clear = () => state.interval && clearInterval(state.interval)

  return {
    show() {
      ws281x.render(state.pixels)

      return this
    },

    hide() {
      clear()

      ws281x.reset()
      ws281x.init(state.count)

      return this
    },

    rainbow(interval = RAINBOW_INTERVAL) {
      clear()

      let offset = 0

      state.interval = setInterval(() => {
        state.pixels = rotatePixelColor(state.pixels, offset)
        offset = (offset + 1) % 256

        this.show()
      }, interval)

      return this
    },

    breath(interval = BREATH_INTERVAL) {
      clear()

      const maximum = max([state.color.red, state.color.green, state.color.blue])
      const minimum = parseInt(maximum / 2, 0)

      let offset = minimum
      let isAdding = true

      state.interval = setInterval(() => {
        if (isAdding) offset += 1
        else offset -= 1

        if (offset <= minimum) {
          offset = minimum
          isAdding = true
        } else if (offset > maximum) {
          offset = maximum
          isAdding = false
        }

        state.pixels = state.pixels.map(() => {
          const { red, green, blue } = getColorOffset(state.color, offset)
          return rgb2Int(red, green, blue)
        })

        this.show()
      }, interval)

      return this
    },
  }
}

// Colorer
const colorer = (state) => {
  return {
    getColor: () => state.color,

    setColor(color) {
      state.color = color
      state.pixels = setPixelData(state.count, state.color)

      if (this.show) this.show()

      return this
    },

    setBrightness(brightness) {
      state.brightness = brightness

      ws281x.setBrightness(brightness)

      return this
    },
  }
}

const createLightService = (count = DEFAULT_COUNT) => {
  try {
    ws281x.init(count)
    console.info('Initialization completed.')
  } catch (err) {
    console.error('Error while initialization:', err)
  }

  const color = { red: 255, green: 255, blue: 255 }
  const pixels = setPixelData(count, color)

  const state = {
    count,
    color,
    pixels,
    brightness: 255,
    interval: null,
  }

  return assign(
    {},
    lighter(state),
    colorer(state),
  )
}

// Initiater
module.exports = createLightService()

process.on('SIGINT', () => {
  ws281x.reset()
  process.nextTick(() => process.exit(0))
})
