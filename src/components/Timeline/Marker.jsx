import React from 'react'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'

import {View} from 'components/View'


export default class Marker extends React.Component {
  static propTypes = {
    plotX: React.PropTypes.func,
    date: React.PropTypes.instanceOf(Date).isRequired,
    radius: React.PropTypes.number,
    style: React.PropTypes.object
  }

  static defaultProps = {
    radius: 5.5
  }

  render () {
    const { date, radius, style, plotX, yPos } = this.props
    return (
      <circle r={radius} cx={plotX(date)} cy={yPos} style={{...defaultStyle, ...style}} />
    )
  }
}


const defaultStyle = { 
  stroke: '#ccc',
  strokeWidth: 3,
  fill: '#fff'
}