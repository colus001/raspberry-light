// @flow

import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Main from './src/Main'

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Main />
      </View>
    )
  }
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
