import React from 'react'
import TransitionGroup from 'react-addons-css-transition-group'
import scale from 'd3-scale'
import {Group, Transform} from 'react-art'

import {View} from 'components/View'


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
    
  }

  render () {
    const {children, plotX, yPos, from, to, height, styles } = this.props

    const newChildren = React.Children.map(children, (child, index) => {
      if(!child || !child.type)
        return child;

      return React.cloneElement(child, {plotX, yPos: height/2, styles: styles[child.type] || {}});
    }, this);

    const numChildren = React.Children.count(newChildren)
    // const groupTransform = new Transform().translate(0, yPos);

    return (
      <Group x={0} y={yPos}>
        <Group>
          {newChildren}
        </Group>
      </Group>
    )
  }
}