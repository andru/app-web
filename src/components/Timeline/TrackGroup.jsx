import React from 'react'
import TransitionGroup from 'react-addons-css-transition-group'

import Track from './Track'

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
    state: React.PropTypes.object,
    actions: React.PropTypes.object,
    plotX: React.PropTypes.func,
    from: React.PropTypes.instanceOf(Date).isRequired,
    to: React.PropTypes.instanceOf(Date).isRequired,
    plotY: React.PropTypes.func,
    styles: React.PropTypes.object,
    trackHeight: React.PropTypes.number,
    ticks: React.PropTypes.object,
    showTicks: React.PropTypes.bool
  };

  static defaultProps = {
    styles: defaultStyles, 
    showTicks: false
  };

  getSharedChildProps () {
    const {
      actions,
      assistedRender,
      isEditing,
      trackGroupIndex,
      plotX,
      plotY,
      from,
      to,
      trackHeight,
      styles,
      ticks,
      showTicks,
      isEven,
      ...childProps 
    } = this.props

    return {
      actions,
      assistedRender,
      isEditing,
      plotX,
      from,
      to,
      height: trackHeight,
      trackGroupIndex,
      ...childProps
    }
  }

  render () {
    const {children, actions, isEditing, trackGroupIndex, plotX, plotY, from, to, trackHeight, styles, ticks,
    showTicks, isEven, ...childProps } = this.props

    const newChildren = this.props.assistedRender ? this.copyChildren() : this.renderChildren()

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

  renderChildren () {
    const {
      tracks,
      trackHeight,
      styles
    } = this.props

    const sharedProps = this.getSharedChildProps()

    return (tracks.map(({from, to, lines, periods, markers, styles}, trackIndex) =>
      (<Track 
        from={from} 
        to={to} 
        key={trackIndex} 
        styles={styles || {}}
        yPos={trackHeight*trackIndex}
        trackIndex={trackIndex}
        lines={lines}
        periods={periods}
        markers={markers}
        {...sharedProps}>
      </Track>)
    ))
  }

  copyChildren () {
    const { children, trackHeight } = this.props

    let sharedProps = this.getSharedChildProps()

    const newChildren = React.Children.map(children, (child, trackIndex) => {
      if(!child || !child.type)
        return child;

      let props = Object.assign(this.getSharedChildProps(), {
        yPos: trackHeight*trackIndex
      })

      return React.cloneElement(child, props);
    }, this);
  }
}