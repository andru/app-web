import React from 'react'
import TransitionGroup from 'react-addons-css-transition-group'
import scale from 'd3-scale'

import Line from './Line'
import Marker from './Marker'
import Period from './Period'

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

  startMarkerMove = (group, track, marker, e) => {
    this.props.actions.startMarkerMove(group, track, marker, e)
  }

  getSharedChildProps () {
    const { children, isEditing, plotX, height, trackGroupIndex, trackIndex } = this.props
    return {
      isEditing,
      plotX,
      yPos: height/2
    }
  }

  render () {
    const {children, actions, isEditing, trackGroupIndex, trackIndex, plotX, yPos, from, to, height, styles } = this.props

    const newChildren = this.props.assistedRender ? this.copyChildren() : this.renderChildren()

    const numChildren = React.Children.count(newChildren)

    return (
      <g transform={`translate(0, ${yPos})`} style={{...defaultStyles.all, ...styles.all}}>
        <g style={{...defaultStyles.inner, ...styles.inner}}>
          {newChildren}
        </g>
      </g>
    )
  }

  renderChildren () {
    const { periods, lines, markers, trackGroupIndex, trackIndex, plotX, height, isEditing } = this.props

    const sharedProps = this.getSharedChildProps()

    let renderedPeriods = periods.map( ({from, to}, i) => (
      <Period from={from} to={to} key={`period-${i}`} {...sharedProps} />) )
    let renderedLines = lines.map( ({from, to, appearance}) => (
      <Line from={from} to={to} appearance={appearance} {...sharedProps} />) )
    let renderedMarkers = markers.map( (marker, index) => (
      <Marker 
        date={marker.date}
        icon={true}
        key={`marker-${index}`}
        appearance={marker.appearance}
        onMouseDown={e => this.startMarkerMove(trackGroupIndex, trackIndex, index, marker, e)}
        {...sharedProps} />
    ) ) 

    return [].concat(renderedPeriods, renderedLines, renderedMarkers)
  }

  copyChildren () {
    const { children, isEditing, plotX, height, trackGroupIndex, trackIndex } = this.props

    const newChildren = React.Children.map(children, (child, index) => {
      if(!child || !child.type)
        return child;

      let sharedProps = this.getSharedChildProps()
      if (child.type === Marker) {
        sharedProps.onMouseDown = e => this.startMarkerMove(trackGroupIndex, trackIndex, index, e)
      }

      return React.cloneElement(child, this.getSharedChildProps());
    }, this);
  }
}