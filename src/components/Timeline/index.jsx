import React from 'react'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
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
    topGutterHeight: React.PropTypes.number
  }

  static defaultProps = {
    trackHeight: 50,
    styles: defaultStyles,
    topGutterHeight: 20
  }

  componentDidMount(){
   // var width = this.refs.svg.offsetWidth;
  }

  render () {
    if (this.props.data) {
      return this.controlledRender( this.props )
    }else{
      return this.assistedRender( this.props )
    }
  }

  controlledRender (props) {
    const {children, data, styles, topGutterHeight} = props
  }

  assistedRender (props) {
    const {children, from, to, trackHeight, styles, topGutterHeight} = props

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
        return React.cloneElement(child, {plotX, format: formatDate, plotY, trackHeight, ticks: timeAxisTicks, isEven: index%2});
      }
    }, this);

    return (
      <Cover>
      <svg style={{...defaultStyles.svg, ...styles.svg}}>
        <rect x={0} y={0} width="100%" height="100%" style={{...defaultStyles.backdrop, ...styles.backdrop}} />
        {newChildren}
      </svg>
      </Cover>
    )    
  }
}

