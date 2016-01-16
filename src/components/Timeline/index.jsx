import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import TransitionGroup from 'react-addons-css-transition-group'
import scale from 'd3-scale'
import _ from 'lodash'

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

const PERIOD = 'period'
const MARKER = 'marker'

let debouncedMouseMoveLogger = _.debounce((ev) => console.log(ev), 50) 

// array reducer. given an unsorted array of dates, reduce to the earliest
function earliest (earliest, value, i) {
  return value < earliest ? value : earliest
}
// array reducer. given an unsorted array of dates, reduce to the latest
function latest (latest, value, i) {
  return value > latest ? value : latest
}

export default class Timeline extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    from: PropTypes.instanceOf(Date).isRequired,
    to: PropTypes.instanceOf(Date).isRequired,
    topGutterHeight: PropTypes.number
  }

  static defaultProps = {
    width: 0,
    height: 0,
    trackHeight: 50,
    styles: defaultStyles,
    topGutterHeight: 20
  }

  state = {
    isEditing: true
  }

  componentDidMount(){
   // var width = this.refs.svg.offsetWidth;
  }

  startMarkerMove = (groupIndex, trackIndex, markerIndex, marker, e) => {
    this.setState({
      isDragging: true,
      dragObject: MARKER,
      dragParams: {groupIndex, trackIndex, markerIndex, marker}
    })
  }

  setMarkerDate = (groupIndex, trackIndex, markerIndex, marker, date) => {
    // console.log(groupIndex, trackIndex, markerIndex, date)
    this.props.onMarkerChange(groupIndex, trackIndex, markerIndex, Object.assign({}, marker, {date: new Date(date)}))
  }

  setPeriodDates = (track, period, dates) => {

  }

  getSVGElement = () => ReactDOM.findDOMNode(this.refs.svg)

  // return an SVG point with the given X, Y coords
  makePoint = (x=0, y=0) => {
    this.point = this.point || this.getSVGElement().createSVGPoint()
    this.point.x = x
    this.point.y = y
    return this.point
  }

  handleMouseMove = (e) => {
    if (this.state.isDragging) {
      let svgEl = this.getSVGElement()
      let mouseP = this.makePoint(e.clientX, e.clientY)
      let mouseToCanvasTM = svgEl.getScreenCTM().inverse().multiply(svgEl.getCTM())
      // let canvasToCurrentTM = currentEl.getCTM().inverse().multiply(mouseToCanvasTM)
      let mouseCanvasP = mouseP.matrixTransform(mouseToCanvasTM)
      // let mouseCurrentP = mouseP.matrixTransform(canvasToCurrentTM)
      // 
      const scale = this.getScale()
      const date = scale.invert(mouseCanvasP.x)
      const {groupIndex, trackIndex, markerIndex, marker} = this.state.dragParams

      switch (this.state.dragObject) {
        case MARKER:
          this.setMarkerDate(groupIndex, trackIndex, markerIndex, marker, date)
        break;
      }
    }
    // debouncedMouseMoveLogger(date)
  }

  handleMouseUp = (e) => {
    this.setState({
      isDragging: false,
      dragObject: undefined,
      dragParams: undefined
    })
  }

  getScale = () => {
    const {from, to, width} = this.props
    if(from !== this.cachedFrom && to !== this.cachedTo){
      this.cachedScale = scale.time()
      .domain([from, to])
      .range([0, width])
      .nice()
    }
    return this.cachedScale
  }

  getChildProps = () => {
    const {from, to, trackHeight, styles, topGutterHeight} = this.props

  }

  render () {
    if (this.props.data) {
      return this.controlledRender( this.props )
    }else{
      return this.assistedRender( this.props )
    }
  }

  controlledRender (props) {
    const {data, from, to, trackHeight, styles, topGutterHeight} = props

    const viewScale = this.getScale()
    const timeAxisTicks = viewScale.ticks()
    const plotX = date => viewScale(date.getTime())
    const formatDate = viewScale.tickFormat()
    var cumulativeY = topGutterHeight
    const plotY = numChildren => {
      let y = cumulativeY
      cumulativeY += trackHeight * numChildren
      return y
    }

    const sharedProps = {
      actions: {
        startMarkerMove: this.startMarkerMove,
        setMarkerDate: this.setMarkerDate,
        setPeriodDates: this.setPeriodDates
      },
      plotX, 
      format: formatDate,
      plotY,
      trackHeight,
      ticks: timeAxisTicks,
      ...this.state
    }

    return (
      <svg style={{...defaultStyles.svg, ...styles.svg}} ref="svg" onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}>
        <rect x={0} y={0} width="100%" height="100%" style={{...defaultStyles.backdrop, ...styles.backdrop}} />
        <TimeAxis {...sharedProps} />
        {data.map( ({name, tracks}, groupIndex) => (
          <TrackGroup
          key={groupIndex}
          from={tracks.map( ({from}) => from ).reduce(earliest)}
          to={tracks.map( ({to}) => to ).reduce(latest)} 
          tracks={tracks}
          isEven={groupIndex%2}
          trackGroupIndex={groupIndex}
          {...sharedProps}>
            
          </TrackGroup>
        ))}
      </svg>
    )  
  }

  assistedRender (props) {
    throw Error('Assisted render is borked')

    const {children, from, to, trackHeight, styles, topGutterHeight} = props
    const viewScale = this.getScale()
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
          actions: {
            startMarkerMove: this.startMarkerMove,
            setMarkerDate: this.setMarkerDate,
            setPeriodDates: this.setPeriodDates
          },
          plotX, 
          format: formatDate,
          plotY,
          trackHeight,
          ticks: timeAxisTicks,
          isEven: index%2,
          assistedRender: true,
          ...this.state
        });
      }
    }, this);

    return (
      <svg style={{...defaultStyles.svg, ...styles.svg}} ref="svg" onMouseMove={this.handleMouseMove}>
        <rect x={0} y={0} width="100%" height="100%" style={{...defaultStyles.backdrop, ...styles.backdrop}} />
        {newChildren}
      </svg>
    )    
  }
}

