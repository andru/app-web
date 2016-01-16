import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native-web'

export default class Cover extends Component {
  render() {
    let {children, style, ...props} = this.props
    return (
      <View style={{...styles.view, ...style}} {...props}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
  	display: 'flex',
    flexGrow: 1,
    flexShrink: 1
  }
})


