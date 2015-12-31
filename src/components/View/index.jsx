import React, { Component } from 'react'
import { PropTypes, StyleSheet, View } from 'react-native-web'

export default class CustomView extends Component {
  render() {
    let {children, ...props} = this.props
    return (
      <View {...props}>
        {children}
      </View>
    );
  }
}

export { CustomView as View }
export Cover from './Cover'