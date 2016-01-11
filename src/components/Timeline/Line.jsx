import React from 'react'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import {Shape} from 'react-art'

import {View} from 'components/View'


export default class Line extends React.Component {
  static propTypes = {
    plotX: React.PropTypes.func,
    from: React.PropTypes.instanceOf(Date).isRequired,
    to: React.PropTypes.instanceOf(Date).isRequired
  }

  static defaultProps = {
    strokeLinecap: 'round',
    strokeWidth: 4,
    stroke: '#6bc25f',
    // fill: 'none'
  }

  render () {
    const {plotX, yPos, from, to, ...styleProps} = this.props
    return (
      <Shape d={`M ${plotX(from)},${yPos} L ${plotX(to)},${yPos}`} {...styleProps} />
    )
  }
}
