import React from 'react'
import TransitionGroup from 'react-addons-css-transition-group'

const defaultStyles = {
  all: {
    
  },
  backdrop: {
    fill: 'transparent',
    strokeWidth: 0
  },
  backdropEven: {
    fill: 'rgba(255,255,255,0.4)',
  },
  backdropOdd: {
  },
  lines: {
    strokeWidth: 1,
    stroke: '#fff'
  }
}

export default class TrackGroup extends React.Component {
  static propTypes = {
    plotX: React.PropTypes.func,
    from: React.PropTypes.instanceOf(Date).isRequired,
    to: React.PropTypes.instanceOf(Date).isRequired,
    plotY: React.PropTypes.func,
    styles: React.PropTypes.object,
    trackHeight: React.PropTypes.number,
    ticks: React.PropTypes.object,
    showTicks: React.PropTypes.bool
  }

  static defaultProps = {
    styles: defaultStyles, 
    showTicks: false
  }

  render () {
    const {children, plotX, plotY, from, to, trackHeight, styles, ticks,
    showTicks, isEven, ...childProps } = this.props

    const newChildren = React.Children.map(children, (child, index) => {
      if(!child || !child.type)
        return child;

      return React.cloneElement(child, {plotX, yPos: trackHeight*index, from, to, height:trackHeight, ...childProps});
    }, this);

    const numChildren = React.Children.count(newChildren)

    return (
      <g transform={`translate(0, ${plotY(numChildren)})`} style={{...defaultStyles.all, ...styles.all}}>
        <rect x={0} y={0} width="100%" height={trackHeight * numChildren} 
        style={{...defaultStyles.backdrop, ...styles.backdrop, ...defaultStyles[`backdrop${isEven?'Even':'Odd'}`], ...styles[`backdrop${isEven?'Even':'Odd'}`]}} />
        <g style={{...defaultStyles.lines, ...styles.lines}}>
        {showTicks && ticks
          .map( date => ({date, xPos:plotX(date)}) )
          .map( ({date, xPos}) => <line x1={xPos} x2={xPos} y1={0} y2={trackHeight * numChildren} />)
        }
        </g>
        {newChildren}
      </g>
    )
  }
}