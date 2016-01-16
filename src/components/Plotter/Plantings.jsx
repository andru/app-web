import React from 'react' 
import ReactDOM from 'react-dom'
import { StyleSheet } from 'react-native-web'

import Planting from './Planting'

import _ from 'lodash'

const defaultStyles = {

}

let debouncedMouseMoveLogger = _.debounce((ev) => console.log(ev), 200)

let minWidth = 100
let minHeight = 20

export default class Plotter extends React.Component {
  static propTypes = {
    height: React.PropTypes.number,
    width: React.PropTypes.number
  }

  static defaultProps = {
    width: 0,
    height: 0
  }

  componentDidMount () {
    window.addEventListener('keydown', this.handleKeyDown)    
  }

  selectPlanting = (planting) => {
    this.props.setCurrent(planting)
  }

  handleMouseDown = (e) => {
    console.log('Mouse down')
    const { updateState } = this.props

  }

  handleMouseUp = (planting, e) => {
    console.log('Mouse up: planting')
    const { updateState } = this.props
    updateState({
      isTranslating: false,
      isScaling: false,
      transformParams: false,
      transformStart: false
    })
  }

  handleMouseLeave = (e) => {
    console.log('mouse leave')
    const { updateState } = this.props
    updateState({
      isTranslating: false,
      isScaling: false,
      transformParams: false,
      transformStart: false
    })
  }

  handleMouseMove = (e) => {
    //requestAnimationFrame(time => this.batchedMouseMove(e))
    this.batchedMouseMove(e)
  }

  makePoint = (x, y) => {
    this.point = this.point || this.props.getSVG().createSVGPoint()
    this.point.x = x
    this.point.y = y
    return this.point
  }

  batchedMouseMove = (e) => {

    const {
      plantings, 
      current,
      isTranslating,
      isScaling,
      isRotating,
      transformStart,
      width,
      height,
      snap,
      zoom,
      padding,
      resolution,
      updateState,
      updateCurrent,
      setCurrentPosition
    } = this.props
    const ev = e.nativeEvent

    debouncedMouseMoveLogger(Object.assign({}, e))

    if (!current) {
      return
    }

    let svgEl = ReactDOM.findDOMNode(this.props.getSVG())
    let currentEl = ReactDOM.findDOMNode(this.refs[current._id])
    //mouse point
    let mouseP = this.makePoint(e.clientX, e.clientY)
    let mouseToCanvasTM = this.props.getSVG().getScreenCTM().inverse().multiply(svgEl.getCTM())
    let canvasToCurrentTM = currentEl.getCTM().inverse().multiply(mouseToCanvasTM)
    //convert the mouse clientXY coords to SVG space
    let mouseCanvasP = mouseP.matrixTransform(mouseToCanvasTM)
    let mouseCurrentP = mouseP.matrixTransform(canvasToCurrentTM)
    //let previousMouseCanvasP = this.makePoint(transformStart.x, transformStart.y).matrixTransform(mouseToCanvasTM)
    //
    console.log(mouseCurrentP, mouseCanvasP)

    let difX = mouseCanvasP.x - transformStart.x
    let difY = mouseCanvasP.y - transformStart.y
    let x = mouseCanvasP.x
    let y = mouseCanvasP.y

    if (snap) {
      x = Math.floor(x / resolution) * resolution || 0
      y = Math.floor(y / resolution) * resolution || 0
    }
    if (isTranslating) {
      //console.log({difX, difY}, transformStart, {x, y})
      //setCurrentPosition(x + deltaX, y + deltaY)
      updateState({
        plantings: plantings.map(p => p._id===current._id ? Object.assign(p, { x: p.x+difX, y:p.y+difY }) : p),
        transformStart: { x, y }
      })
    } else if (isScaling) {
      //console.dir(ReactDOM.findDOMNode(this.refs[current._id].refs.bodyRect))
      let {width, height, surface} = transformStart
      let newX = transformStart.x
      let newY = transformStart.y

      switch (surface) {
        case 1: // top
          height = height + mouseCurrentP.y*-1
          newY = mouseCanvasP.y
          break;
        case 2: // right
          width = width - (width - mouseCurrentP.x)
          break;
        case 3: // bottom
          height = height - (height - mouseCurrentP.y)
          break;
        case 4: // left
          width = width + mouseCurrentP.x*-1
          newX = mouseCanvasP.x
          break; 
      }

      updateCurrent({
        x: newX,
        y: newY,
        width: Math.max(minWidth, width),
        height: Math.max(minHeight, height)
      })

    } else if (isRotating) {
      // dx = resistor_x - mouse_x
      // dy = resistor_y - mouse_y
      // theta = 90+Math.atan2(dy, dx)*180/Math.PI
    }
  }

  handleTranslate = (planting_id, e) => {
    const planting = this.props.plantings.find(p => p._id === planting_id)
    const ev = e.nativeEvent
    this.selectPlanting(planting)

    const {
      zoom,
      snap,
      resolution,
      updateState
    } = this.props

    let svgEl = ReactDOM.findDOMNode(this.props.getSVG())
    let currentEl = ReactDOM.findDOMNode(this.refs[planting._id])
    //mouse point
    let mouseP = this.makePoint(e.clientX, e.clientY)
    let mouseToCanvasTM = this.props.getSVG().getScreenCTM().inverse().multiply(svgEl.getCTM())
    let canvasToCurrentTM = mouseToCanvasTM.inverse().multiply(currentEl.getCTM())
    let mouseCanvasP = mouseP.matrixTransform(mouseToCanvasTM)

    console.log(mouseP.matrixTransform(mouseToCanvasTM), 
      mouseP.matrixTransform( currentEl.getCTM().inverse() ),
      mouseP.matrixTransform( currentEl.getCTM().inverse().multiply(mouseToCanvasTM) )
    )

    let x = mouseCanvasP.x
    let y = mouseCanvasP.y
    if (snap) {
      x = Math.floor(x / resolution) * resolution || 0
      y = Math.floor(y / resolution) * resolution || 0
    }
    updateState({
      selected: true,
      current: planting,
      isTranslating: true,
      transformStart: { x, y}
    })
  }

  handleScale = (planting_id, surface, e) => {
    const planting = this.props.plantings.find(p => p._id === planting_id)

    this.selectPlanting(planting)

    let ev = e.nativeEvent

    const {
      zoom,
      padding,
      snap,
      resolution,
      updateState
    } = this.props
    const {
      width,
      height
    } = planting
    // const ev = e.nativeEvent
    let x = ev.offsetX  
    let y = ev.offsetY  
    if (snap) {
      x = Math.floor(x / resolution) * resolution || 0
      y = Math.floor(y / resolution) * resolution || 0
    }
    updateState({
      isScaling: true,
      transformStart: { x: planting.x, y: planting.y, width, height, surface, original:{x, y, width, height} }
    })
  }

  handleRotate = (planting, e) => {
    const {
      updateState
    } = this.props

    updateState({
      isRotating: true
    })
  }

  handleKeyDown = (e) => {
    console.log(e.keyCode)
    const {
      plantings,
      current,
      width,
      height,
      snap,
      resolution,
      setCurrentPosition
    } = this.props
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) {
      return
    }
    if (!current) {
      return
    }
    let {x, y} = plantings.find(p => p._id === current._id)
    switch (e.keyCode) {
      case 38: // Up
        e.preventDefault()
        if (y > 0) {
          y = snap ? y - resolution : y - 1
        }
        break
      case 40: // Down
        e.preventDefault()
        if (y) {
          y = snap ? y + resolution : y + 1
        }
        break
      case 37: // Left
        e.preventDefault()
        if (x > 0) {
          x = snap ? x - resolution : x - 1
        }
        break
      case 39: // Right
        e.preventDefault()
        if (x) {
          x = snap ? x + resolution : x + 1
        }
        break
    }
    setCurrentPosition(x, y)
  }

  handleMouseOver = e => { this.props.setCursor('move') }
  handleMouseOut = e => { this.props.setCursor() }


  render () {
    let {plantings, current, width, height, cursor, setCursor} = this.props

    return (
      <g>
        {plantings
          .map(planting => <Planting
            ref={planting._id} 
            key={planting._id}
            onMouseMove={this.handleMouseMove}
            onTranslate={this.handleTranslate}
            onScale={this.handleScale}
            onRotate={this.handleRotate}
            onMouseUp={this.handleMouseUp}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
            setCursor={setCursor}
            isSelected={current && current._id === planting._id} 
            planting={planting} />
          )
        }
      </g>
    )  
  }

}

