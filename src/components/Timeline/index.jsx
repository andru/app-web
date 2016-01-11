import React from 'react' 
import ReactDOM from 'react-dom'
import shallowCompare from 'react/lib/shallowCompare'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import ReactART, {Surface} from 'react-art'
ReactART.mode('svg')
// import Rectangle from 'react-art/shapes/rectangle'

import {Rectangle} from 'components/Shapes'

import scale from 'd3-scale'

import {Cover} from 'components/View'

import TrackGroup from './TrackGroup'
import Track from './Track'
import Line from './Line'
import Marker from './Marker'
import Period from './Period'
import TimeAxis from './TimeAxis'

export TrackGroup from './TrackGroup'
export Track from './Track'
export Line from './Line'
export Marker from './Marker'
export Period from './Period'
export TimeAxis from './TimeAxis'


const defaultStyles = {
  svg: {
    overflow:'visible',
    userSelect:'none',
    display: 'flex',
    flex: 1
  },
  backdrop: {
    fill: '#F5F4E9'
  }
}

export default class Timeline extends React.Component {
  static propTypes = {
    from: React.PropTypes.instanceOf(Date).isRequired,
    to: React.PropTypes.instanceOf(Date).isRequired,
    height: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    topGutterHeight: React.PropTypes.number
  }

  static defaultProps = {
    trackHeight: 50,
    styles: defaultStyles,
    topGutterHeight: 20,
    width: 0,
    height: 0
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  render () {
    if (this.props.data) {
      return this.controlledRender( this.props )
    }else{
      return this.assistedRender( this.state, this.props )
    }
  }

  controlledRender (props) {
    const {children, data, styles, topGutterHeight} = props
  }

  assistedRender (state, props) {
    const {children, width, height, from, to, trackHeight, styles, topGutterHeight} = props

    const viewScale = scale.time()
    .domain([from, to])
    .range([0, document.body.clientWidth])
    .nice()

    const timeAxisTicks = viewScale.ticks()

    const plotX = date => viewScale(date.getTime())
    const formatDate = viewScale.tickFormat()

    var cumulativeY = topGutterHeight
    const plotY = numChildren => {
      let y = cumulativeY
      cumulativeY += trackHeight * numChildren
      return y
    }

    const newChildren = React.Children.map(children, (child, index) => {
      if (child.type) {
        return React.cloneElement(child, {
          timelineWidth: width, 
          timelineHeight: height, 
          plotX, 
          format: formatDate,
          plotY,
          trackHeight,
          ticks: timeAxisTicks,
          isEven: index%2});
      }
    }, this);

    return (
      <Cover ref="container">
      <Surface width={width} height={height}>
        <Rectangle width={width} height={height} {...{...defaultStyles.backdrop, ...styles.backdrop}} />
        {newChildren}
      </Surface>
      </Cover>
    )    
  }
}

