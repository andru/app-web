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
    WebkitUserSelect: 'none',
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
    topGutterHeight: PropTypes.number,
    onMarkerChange: PropTypes.func,
    onMarkerEditIntent: PropTypes.func,
    onDateRangeChange: PropTypes.func,
    styles: PropTypes.object
  };

  static defaultProps = {
    width: 0,
    height: 0,
    trackHeight: 50,
    styles: defaultStyles,
    topGutterHeight: 20
  };

  // todo: move state to 'uncontrollable' component props
  state = {
    isEditing: false,
    hoveredTrackIndex: [undefined, undefined],
    selectedTrackIndex: [undefined, undefined]
  };

  componentDidMount(){
   // var width = this.refs.svg.offsetWidth;
  }

  componentDidUpdate () {
  }

  hoverTrack = (groupIndex, trackIndex) => {
    this.setState({
      hoveredTrackIndex: [groupIndex, trackIndex]
    })
  };

  selectTrack = (groupIndex, trackIndex) => {
    this.setState({
      selectedTrackIndex: [groupIndex, trackIndex]
    })
  };

  deselectTrack = (groupIndex, trackIndex) => {
    this.setState({
      selectedTrackIndex: [undefined, undefined]
    })
  };

  startMarkerMove = (groupIndex, trackIndex, markerIndex, marker, e) => {
    this.setState({
      isDragging: true,
      dragObject: MARKER,
      dragParams: {groupIndex, trackIndex, markerIndex, marker}
    })
  };

  setMarkerDate = (groupIndex, trackIndex, markerIndex, marker, date) => {
    // console.log(groupIndex, trackIndex, markerIndex, date)
    this.props.onMarkerChange(groupIndex, trackIndex, markerIndex, Object.assign({}, marker, {date: new Date(date)}))
  };

  setPeriodDates = (track, period, dates) => {

  };

  getSVGElement = () => ReactDOM.findDOMNode(this.refs.svg);

  // return an SVG point with the given X, Y coords
  makePoint = (x=0, y=0) => {
    this.point = this.point || this.getSVGElement().createSVGPoint()
    this.point.x = x
    this.point.y = y
    return this.point
  };

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
  };

  handleMouseUp = (e) => {
    this.setState({
      isDragging: false,
      dragObject: undefined,
      dragParams: undefined
    })
  };

  handleMouseWheel = (e) => {
    // console.log(e)
    if (e.deltaX !== 0) {
      // console.log(e.deltaX)
      const {from, to} = this.props
      const scale = this.getScale()
      const fromPos = scale(from)
      const toPos = scale(to)
      let fromDate = scale.invert(fromPos + e.deltaX)
      let toDate = scale.invert(toPos + e.deltaX)
      // console.log(fromDate, toDate)
      this.props.onDateRangeChange(fromDate, toDate)
    }
  };

  editMarker = (groupIndex, trackIndex, markerIndex, marker) => {
    this.props.onMarkerEditIntent(groupIndex, trackIndex, markerIndex, marker)
  };

  getScale = () => {
    const {from, to, width} = this.props
    if(from !== this.cachedFrom && to !== this.cachedTo){
      this.cachedFrom = from
      this.cachedTo = to
      this.cachedScale = scale.scaleTime()
      .domain([from, to])
      .range([-100, width+100])
      // .nice()
    }
    return this.cachedScale
  };

  getChildProps = () => {
    const {from, to, trackHeight, styles, topGutterHeight} = this.props

  };

  render () {
    if (this.props.data) {
      return this.controlledRender( this.props )
    }else{
      return this.assistedRender( this.props )
    }
  }

  controlledRender (props) {
    const {data, width, height, from, to, trackHeight, styles, topGutterHeight} = props
    const {hoveredTrackIndex, selectedTrackIndex} = this.state

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
    let totalHeight = data.reduce((totalHeight, {tracks}) => {
      return totalHeight + tracks.length*trackHeight
    }, topGutterHeight)


    const sharedProps = {
      actions: {
        startMarkerMove: this.startMarkerMove,
        setMarkerDate: this.setMarkerDate,
        setPeriodDates: this.setPeriodDates,
        editMarker: this.editMarker,
        hoverTrack: this.hoverTrack,
        selectTrack: this.selectTrack,
        deselectTrack: this.deselectTrack
      },
      plotX,
      format: formatDate,
      plotY,
      trackHeight,
      ticks: timeAxisTicks,
      ...this.state
    }
    const svgStyles = {
      ...defaultStyles.svg,
      width,
      minHeight: height,
      height: totalHeight,
      ...styles.svg
    }
    return (
      <svg
        style={svgStyles}
        ref="svg"
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onWheel={this.handleMouseWheel}
      >
        <rect x={0} y={0} width="100%" height="100%" style={{...defaultStyles.backdrop, ...styles.backdrop}} />
        <TimeAxis {...sharedProps} />
        {data.map( ({name, tracks}, groupIndex) => (
          <TrackGroup
            key={groupIndex}
            from={tracks.map( ({from}) => from ).reduce(earliest)}
            to={tracks.map( ({to}) => to ).reduce(latest)}
            tracks={tracks}
            isHovered={hoveredTrackIndex[0]===groupIndex}
            isSelected={selectedTrackIndex[0]===groupIndex}
            isEven={groupIndex%2}
            trackGroupIndex={groupIndex}
            {...sharedProps} />
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
            setPeriodDates: this.setPeriodDates,
            editMarker: this.editMarker
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
