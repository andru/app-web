
import React, {Component} from 'react'
import {Group, Shape, Path} from 'react-art'

export default class Grid extends Component {

  render () {
    let { grid, preview, width, height, resolution } = this.props

    function getLines (x, y, step) {
      let lines = []
      for (var i = 0; i <= y; i++) {
        lines.push([
          'M', 0, i * step,
          'H', width
        ].join(' '))
      }
      for (var i = 0; i <= x; i++) {
        lines.push([
          'M', i * step, 0,
          'V', height
        ].join(' '))
      }
      return lines.join(' ')
    }

    let minor = [
      getLines(width / resolution, height / resolution, resolution)
    ].join(' ')
    let major = [
      getLines(width / 16, height / 16, 16)
    ].join(' ')

    let styles = {
      minor: {
        stroke: '#fff',
        strokeWidth: .5,
        vectorEffect: 'non-scaling-stroke',
        opacity: .5,
      },
      major: {
        stroke: '#fff',
        strokeWidth: .5,
        vectorEffect: 'non-scaling-stroke',
        opacity: .75
      }
    }

    // if (!grid || preview) {
    //   return false
    // }


    return (
      <Group>
        <Shape d={minor} {...styles.minor} />
        <Shape d={major} {...styles.major} />
      </Group>
    )
  }

}
