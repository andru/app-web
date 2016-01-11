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

  cursorPoint = (e) => {
    let pt = this.props.getSVG().createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    return pt.matrixTransform(this.props.getSVG().getScreenCTM().inverse())
  }

  batchedMouseMove = (e) => {

    const {
      plantings,
      isTranslating,
      isScaling,
      transformStart,
      current,
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
    
    let x = ev.offsetX
    let y = ev.offsetY

    let deltaX = x - transformStart.x
    let deltaY = y - transformStart.y

    let pt = this.props.getSVG().createSVGPoint()

    let currentCursor = this.cursorPoint(ev)

    if (snap) {
      x = Math.floor(x / resolution) * resolution || 0
      y = Math.floor(y / resolution) * resolution || 0
    }
    if (isTranslating) {
      console.log(transformStart, {deltaX, deltaY})
      //setCurrentPosition(x + deltaX, y + deltaY)
      updateState({
        plantings: plantings.map(p => p._id===current._id ? Object.assign(p, { x: current.x + deltaX, y: current.y + deltaY }) : p),
        transformStart: { x: x, y: y }
      })
    } else if (isScaling) {
      console.dir(ReactDOM.findDOMNode(this.refs[current._id].refs.bodyRect))
      let {width, height, surface} = transformStart
      let newX = transformStart.x
      let newY = transformStart.y


      // let rectXY = pointIn(rect,dot.cx.animVal.value,dot.cy.animVal.value)
      pt.x = x
      pt.y = y
      let rectXY = pt.matrixTransform(ReactDOM.findDOMNode(this.refs[current._id].refs.container).getTransformToElement(this.props.getSVG()).inverse())
      width = Math.max( rectXY.x-rect.x.animVal.value, 1 )
      height = Math.max( rectXY.y-rect.y.animVal.value, 1 )

      // const cx = current.width/2
      // const cy = current.height/2
      // const xN = (x - cx) / (transformStart.x - cx)
      // const yN = (y - cy) / (transformStart.y - cy)
      // const n = (Math.abs(xN) >= Math.abs(yN) ? xN : yN)

      switch (surface) {
        case 1: // top
        console.log(x, y)
          // height = height + y*-1
          newY = e.offsetY
          break;
        case 2: // right
          // width = x
          break;
        case 3: // bottom
          // height = y
          break;
        case 4:
          // width = width + x*-1
          newX = e.offsetX
          break; 
      }


      updateCurrent({
        x: newX,
        y: newY,
        width: Math.max(minWidth, width),
        height: Math.max(minHeight, height)
      })
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
    let x = ev.offsetX
    let y = ev.offsetY
    if (snap) {
      x = Math.floor(x / resolution) * resolution || 0
      y = Math.floor(y / resolution) * resolution || 0
    }
    updateState({
      selected: true,
      current: planting,
      isTranslating: true,
      transformStart: { x, y }
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
      transformStart: { x: planting.x, y: planting.y, width, height, surface, cursorTransform: this.cursorPoint(ev) }
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
            onMouseUp={this.handleMouseUp}
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
            onScale={this.handleScale}
            setCursor={setCursor}
            isSelected={current && current._id === planting._id} 
            planting={planting} />
          )
        }
      </g>
    )  
  }

}

