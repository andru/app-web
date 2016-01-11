import React from 'react' 
import ReactDOM from 'react-dom'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import scale from 'd3-scale'

import ReactART, {Surface} from 'react-art'
ReactART.mode('svg')
// import Rectangle from 'react-art/shapes/rectangle'

import {Rectangle} from 'components/Shapes'

import Background from './Background' 
import Grid from './Grid'
import Plantings from './Plantings'

//export Grid from './Grid'


const defaultStyles = {

}

export default class Plotter extends React.Component {

  static propTypes = {
    height: React.PropTypes.number,
    width: React.PropTypes.number
  }

  static defaultProps = {
    width: 0,
    height: 0
  }

  state = {
    plantings: this.props.plantings,
    current: undefined, // current planting
    selected: false, // full path selected
    zoom: 1,
    grid: true,
    resolution: 64,
    snap: false,
    preview: false,
    mode: 'select',
    history: [],
    cursor: undefined,
    isTranslating: false,
    isScaling: false,
    transformParams: false,
    transformStart: false,
  }

  componentWillMount () {
    this.orderZIndex()
  }

  componentWillReceiveProps (props) {
    console.log('receiving props', props);
  }

  updateState = (state) => this.setState(state)

  orderZIndex = () => {
    this.setState({
      plantings: this.state.plantings
        .sort((a, b) => a.zIndex < b.zIndex ? -1 : 1) 
        .map((p, i) => Object.assign(p, {zIndex: i}))
    })
  }

  deselectAll = () => this.setState({
    selected: false,
    current: undefined
  })

  setCurrent = (planting) => {
    this.setState({current: Object.assign({}, planting, {zIndex: this.state.plantings.length*999})})
    this.orderZIndex()
  }

  setZoom = zoom => this.setState({zoom: zoom})

  setCurrentPosition = (x, y) => this.updateCurrent({x, y})

  updateCurrent = change => {
    let planting = this.state.plantings.find(p => p._id === this.state.current._id)
    let changed = Object.assign({}, planting, change)

    this.setState({
      plantings: this.state.plantings.map(p => p._id===this.state.current._id ? changed : p),
      current: planting
    })
  }

  setCursor = cursor => {
    this.setState({cursor})
  }

  render () {
    let {width, height} = this.props

    return (
      <svg width={width} height={height}  viewBox={`0 0 ${width} ${height}`} 
      xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full"
      ref="svg">
        <Background updateState={this.updateState} deselectAll={this.deselectAll} {...{...this.state, width, height}}/>
        <Grid {...{width, height, resolution: this.state.resolution}} />
        <Plantings 
        getSVG={() => this.refs.svg}
        updateState={this.updateState} 
        setCurrent={this.setCurrent}
        updateCurrent={this.updateCurrent}
        setCurrentPosition={this.setCurrentPosition}
        setCursor={this.setCursor} {...this.state} />
      </svg>
    )  
  }

}

