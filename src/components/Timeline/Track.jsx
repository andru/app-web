import React from 'react'
import TransitionGroup from 'react-addons-css-transition-group'
import scale from 'd3-scale'

import {View} from 'components/View'

const defaultStyles = {
  all: {
    stroke: '#6bc25f',
    fill: '#6bc25f'
  },
  outer: {

  }
}

export default class Track extends React.Component {
  static propTypes = {
    // plotX: React.PropTypes.func.isRequired,
    yPos: React.PropTypes.number,
    from: React.PropTypes.instanceOf(Date).isRequired,
    to: React.PropTypes.instanceOf(Date).isRequired,
    styles: React.PropTypes.object,
    height: React.PropTypes.number
  }

  static defaultProps = {
    styles: defaultStyles
  }

  render () {
    const {children, plotX, yPos, from, to, height, styles } = this.props

    const newChildren = React.Children.map(children, (child, index) => {
      if(!child || !child.type)
        return child;

      return React.cloneElement(child, {plotX, yPos: height/2});
    }, this);

    const numChildren = React.Children.count(newChildren)

    return (
      <g transform={`translate(0, ${yPos})`} style={{...defaultStyles.all, ...styles.all}}>
        <g style={{...defaultStyles.inner, ...styles.inner}}>
          {newChildren}
        </g>
      </g>
    )
  }
}