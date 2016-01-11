/**
* Example usage:
* <Rectangle
*   width={50}
*   height={50}
*   stroke="green"
*   fill="blue"
* />
*
* Additional optional properties:
*   (Number) radius
*   (Number) radiusTopLeft
*   (Number) radiusTopRight
*   (Number) radiusBottomLeft
*   (Number) radiusBottomRight
*/

import React, {Component, PropTypes} from 'react'
import ReactART, {Shape, Path} from 'react-art'

/**
* Rectangle is a React component for drawing rectangles. Like other ReactART
* components, it must be used in a <Surface>.
*/
export default class Rectangle extends React.Component{

  static propTypes = {
    x1: PropTypes.number,
    x2: PropTypes.number,
    y1: PropTypes.number,
    y2: PropTypes.number,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    radius: PropTypes.number,
    radiusTopLeft: PropTypes.number,
    radiusTopRight: PropTypes.number,
    radiusBottomRight: PropTypes.number,
    radiusBottomLeft: PropTypes.number
  }

  static defaultProps = {
    x: 0,
    y: 0,
    radius: 0
  }

  render() {

    let {width, height, radius, ...shapeProps} = this.props

    // if unspecified, radius(Top|Bottom)(Left|Right) defaults to the radius
    // property
    let tl = this.props.radiusTopLeft || radius
    let tr = this.props.radiusTopRight || radius
    let br = this.props.radiusBottomRight || radius
    let bl = this.props.radiusBottomLeft || radius

    let path = Path()

    // for negative width/height, offset the rectangle in the negative x/y
    // direction. for negative radius, just default to 0.
    if (width < 0) {
      path.move(width, 0)
      width = -width
    }
    if (height < 0) {
      path.move(0, height)
      height = -height
    }
    if (tl < 0) {
      tl = 0
    }
    if (tr < 0) {
      tr = 0
    }
    if (br < 0) {
      br = 0
    }
    if (bl < 0) {
      bl = 0
    }

    // clamp border width and height to half width
    if (tl + tr > width) { 
      tl = width/2
      tr = width/2
    }
    if (bl + br > width) { 
      bl = width/2
      br = width/2
    }
    if (tl + bl > height) { 
      tl = width/2
      bl = width/2
    }
    if (tr + br > height) { 
      tr = width/2
      br = width/2
    }

    path.move(0, tl)

    if (tl > 0) {
      path.arc(tl, -tl)
    }
    path.line(width - (tr + tl), 0)

    if (tr > 0) {
      path.arc(tr, tr)
    }
    path.line(0, height - (tr + br))

    if (br > 0) {
      path.arc(-br, br)
    }
    path.line(- width + (br + bl), 0)

    if (bl > 0) {
      path.arc(-bl, -bl)
    }
    path.line(0, - height + (bl + tl))

    return React.createElement(Shape, {...shapeProps, d:path})
  }

}