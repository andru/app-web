import React, {Component} from 'react'
import ReactDOM from 'react-dom'

export default class Background extends Component {

  handleMouseDown = e => {
    this.props.deselectAll()
  };

  handleMouseUp = e => this.props.isTranslating && this.props.updateState({isTranslating: false});

  render () {
    let { width, height } = this.props


    let styles = {
      bg: {
        fill: '#F1BD54'
      },
    }

    // if (!grid || preview) {
    //   return false
    // }


    return (
      <g>
        <rect {...{...styles.bg, width, height}} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} ref="background"  />
      </g>
    )
  }

}
