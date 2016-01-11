
import React, {Component} from 'react'
import {Rectangle} from 'components/Shapes'

export default class Background extends Component {

  handleMouseDown = e => this.props.deselectAll()

  handleMouseUp = e => this.props.isTranslating && this.props.updateState({isTranslating: false})

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
        <Rectangle {...{...styles.bg, width, height}} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}  />
    )
  }

}