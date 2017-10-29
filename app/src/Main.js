// @flow

import { find, throttle } from 'lodash'
import React, { Component } from 'react'
import { View, Text, Button, Dimensions, StyleSheet } from 'react-native'
import { BleManager } from 'react-native-ble-plx'
import base64 from 'base-64'

import ble from 'services/ble'

import { ColorPicker, fromHsv } from 'react-native-color-picker'

const { width } = Dimensions.get('window')

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return {
    red: parseInt(result[1], 16),
    green: parseInt(result[2], 16),
    blue: parseInt(result[3], 16)
  };
}

const hsvToRgb = ({ h, s, v }) => {
  var r, g, b;

  var i = Math.floor(h * 6);
  var f = h * 6 - i;
  var p = v * (1 - s);
  var q = v * (1 - f * s);
  var t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  return {
    red: r * 255,
    green: g * 255,
    blue: b * 255,
  }
}


class Main extends Component {
  constructor(props) {
    super(props)

    this.timeout = null
    this.state = {
      isReady: false,
    }
  }

  componentDidMount() {
    console.log('componentDidMount')
    ble.isInitiated(() => {
      this.scanAndConnect()
    })
  }

  async scanAndConnect() {
    const device = await ble.scan()
    await ble.connect(device)

    this.setState({
      isReady: true,
    })
  }

  handlePress = (status, interval = 50) => () => {
    ble.send({
      type: status,
      interval,
    })
  }

  handleColorChange = throttle((v) => {
    const color = typeof v === 'string' ? hexToRgb(v) : hexToRgb(fromHsv({ ...v }))

    ble.send({
      type: 'COLOR',
      color: Object.assign(color, { alpha: 255 }),
    })
  }, 100)

  render() {
    const { isReady } = this.state

    return (
      <View style={styles.container}>
        <View style={styles.buttonWrapper}>
          <Button
            disabled={!isReady}
            title="켜기"
            onPress={this.handlePress('SHOW')}
          />
          <Button
            disabled={!isReady}
            title="끄기"
            onPress={this.handlePress('HIDE')}
          />
        </View>

        <ColorPicker
          onColorSelected={this.handleColorChange}
          onColorChange={this.handleColorChange}
          style={styles.colorPicker}
        />

      </View>
    )
  }
}

export default Main

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: 100,
  },
  colorPicker: {
    width: width - 60,
    marginHorizontal: 30,
    height: 300,
  }
})
