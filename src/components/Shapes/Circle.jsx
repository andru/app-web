/**
 * Example usage:
 * <Circle
 *   radius={50}
 *   stroke="green"
 *   fill="blue"
 * />
 *
 */

import React from 'react'
import ReactART, {Shape, Path} from 'react-art'


const Props = React.PropTypes;

/**
 * Circle is a React component for drawing circles. Like other ReactART
 * components, it must be used in a <Surface>.
 */
export default class Circle extends React.Component{

  static propTypes = {
    radius: Props.number.isRequired
  }

  render () {
    const {radius, ...shapeProps} = this.props;

    var path = Path().moveTo(0, -radius)
        .arc(0, radius * 2, radius)
        .arc(0, radius * -2, radius)
        .close();
    return React.createElement(Shape, {...shapeProps, d: path}) 
  }

}