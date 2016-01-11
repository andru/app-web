import React from 'react'
import TransitionGroup from 'react-addons-css-transition-group'
import {Group, Transform} from 'react-art'
import Rectangle from 'components/Shapes/Rectangle'

import {View} from 'components/View'

const defaultStyle = { 
  strokeWidth: 0,
  // fillOpacity: 0.5,
  opacity: 0.5,
  height: 10,
  // stroke: 'none',
  fill: '#6bc25f'
}

export default class Period extends React.Component {
  static propTypes = {
    plotX: React.PropTypes.func,
    from: React.PropTypes.instanceOf(Date).isRequired,
    to: React.PropTypes.instanceOf(Date).isRequired,
    style: React.PropTypes.object
  }

  static defaultProps = {
    style: defaultStyle
  }

  render () {
    const {children, plotX, yPos, from, to, style} = this.props
    const xPos = plotX(from);
    const width = plotX(to) - xPos

    // x,yPos-10
    return (
      <Rectangle x={xPos} y={yPos-10} width={width} height={10} radiusTopLeft={4} radiusTopRight={4} {...{...defaultStyle, ...style}} />
    )
  }
}


