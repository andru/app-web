import React from 'react'
import TransitionGroup from 'react-addons-css-transition-group'
import {Group, Transform} from 'react-art'
// import Rectangle from 'react-art/shapes/rectangle'
import Rectangle from 'components/Shapes/Rectangle'



const defaultStyles = {
  backdrop: {
    fill: 'rgba(255,255,255,0)',
    strokeWidth: 0
  },
  backdropEven: {
    fill: 'rgba(255,255,255,0.4)',
  },
  backdropOdd: {
  },
  lines: {
    strokeWidth: 1,
    stroke: 'rgb(255,255,255)'
  }
}

export default class TrackGroup extends React.Component {
  static propTypes = {
    plotX: React.PropTypes.func,
    from: React.PropTypes.instanceOf(Date).isRequired,
    to: React.PropTypes.instanceOf(Date).isRequired,
    plotY: React.PropTypes.func,
    styles: React.PropTypes.object,
    timelineHeight: React.PropTypes.number,
    timelineWidth: React.PropTypes.number,
    trackHeight: React.PropTypes.number,
    ticks: React.PropTypes.object,
    showTicks: React.PropTypes.bool
  }

  static defaultProps = {
    styles: defaultStyles, 
    showTicks: false
  }

  render () {
    const {timelineWidth, timelineHeight, children, plotX, plotY, from, to, trackHeight, styles, ticks,
    showTicks, isEven, ...childProps } = this.props

    const newChildren = React.Children.map(children, (child, index) => {
      if(!child || !child.type)
        return child;

      return React.cloneElement(child, {plotX, yPos: trackHeight*index, from, to, height:trackHeight, ...childProps});
    }, this);

    const numChildren = React.Children.count(newChildren)

    // const groupTransform = new Transform().translate(0, plotY(numChildren));

    return (
      <Group x={0} y={plotY(numChildren)}>
        <Rectangle x={0} y={0} width={timelineWidth} height={trackHeight * numChildren} {...{...defaultStyles.backdrop, ...styles.backdrop, ...defaultStyles[`backdrop${isEven?'Even':'Odd'}`], ...styles[`backdrop${isEven?'Even':'Odd'}`]}} />
        <Group>
        {showTicks && ticks
          .map( date => ({date, xPos:plotX(date)}) )
          .map( ({date, xPos}) => <Shape d={`M ${xPos},0 L ${xPos},${trackHeight * numChildren}`} {...{...defaultStyles.lines, ...styles.lines}} />)
        }
        </Group>
        {newChildren}
      </Group>
    )
  }
}