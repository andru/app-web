import React from 'react'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import {Shape, Transform} from 'react-art'

import Rectangle from 'components/Shapes/Rectangle'
import Circle from 'components/Shapes/Circle'


import {View} from 'components/View'
 
const defaultStyles = { 
  circle: {
    stroke: '#6bc25f',
    strokeWidth: 3,
    fill: '#fff'
  },
  arrow: {
    strokeWidth: 0,
    fill: '#6bc25f'
  }
  
}

export default class Marker extends React.Component {
  static propTypes = {
    plotX: React.PropTypes.func,
    date: React.PropTypes.instanceOf(Date).isRequired,
    radius: React.PropTypes.number,
    style: React.PropTypes.object,
    appearance: React.PropTypes.oneOf(['circle', 'rightArrow', 'leftArrow'])
  }

  static defaultProps = {
    radius: 5.5,
    appearance: 'circle',
    style: defaultStyles,
    cursor: 'pointer'
  }

  render () {
    switch (this.props.appearance) {
      default:
      case 'circle':
        return this.circleMarker(this.props)
      case 'rightArrow':
        return this.rightArrowMarker(this.props)
      case 'leftArrow':
        return this.leftArrowMarker(this.props)
    }
  }

  circleMarker ({radius, date, plotX, yPos, style}) {
    const transform = new Transform().translate(plotX(date), yPos);
    return <Circle radius={radius} transform={transform} {...{...defaultStyles.circle, ...style.circle}} />
    // return <Rectangle width={radius} height={radius} />
  }

  leftArrowMarker ({radius, date, plotX, yPos, style}) {
    let baseX = plotX(date)
    return <Shape d={`10,0 0,5, 10,10`} {...{...defaultStyles.arrow, ...style.arrow}} />
  }

  rightArrowMarker ({radius, date, plotX, yPos, style}) {
    let baseX = plotX(date)
    return <Shape d={`M ${baseX},${yPos-radius} L ${baseX+radius*2},${yPos} ${baseX},${yPos+radius} Z`} {...{...defaultStyles.arrow, ...style.arrow}} />
  }
}