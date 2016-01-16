import React from 'react'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'

import {View} from 'components/View'


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
    appearance: 'circle'
  }

  render () {
    const {
      isEditing,
      styles
    } = this.props

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

  circleMarker ({isEditing, radius, date, plotX, yPos, onMouseDown, styles={}}) {
    styles = {...defaultStyles.circle, ...styles.circle}
    if (isEditing) {
      styles.cursor = 'ew-resize'
    }
    return <circle r={radius} cx={plotX(date)} cy={yPos} style={styles} onMouseDown={onMouseDown} />
  }

  leftArrowMarker ({radius, date, plotX, yPos, styles={}}) {
    let baseX = plotX(date)
    return <polygon points={`10,0 0,5, 10,10`} style={{...defaultStyles.arrow, ...styles.arrow}} />
  }

  rightArrowMarker ({radius, date, plotX, yPos, styles={}}) {
    let baseX = plotX(date)
    return <polygon points={`${baseX},${yPos-radius} ${baseX+radius*2},${yPos}, ${baseX},${yPos+radius}`} style={{...defaultStyles.arrow, ...styles.arrow}} />
  }
}


const defaultStyles = { 
  circle: {
    strokeWidth: 3,
    fill: '#fff'
  },
  arrow: {
    stroke: 'transparent',
    strokeWidth: 0
  }
}