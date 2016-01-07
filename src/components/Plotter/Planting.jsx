
import React, {Component} from 'react'
import {Group, Text} from 'react-art'
import {Rectangle, Circle} from 'components/Shapes'

export default class Planting extends Component {

  render () {
    let { planting, isSelected, setCursor,
          onMouseOver, onMouseOut, onMouseMove, onTranslate, onMouseUp, onKeyDown,
          onScale  } = this.props
    let { name, progress, x, y, width, height, rotation } = planting

    if (isSelected){
      console.log('rendering planting', planting.x, planting.y, planting.width, planting.height, planting);
    }

    let styles = {
      body: {
        fill: '#FFF'
      },
      progress: {
        fill: '#F06F68',
        y: -6
      },
      label: {
        fill: '#F06F68',
        fontFamily: 'Museo Sans'
      },
      caret: {
        fill: '#F06F68'
      },
      handle: {
        fill: '#F06F68'
      },
      hitBox: {
        fill: '#fff',
        opacity: .3,
      }
    }

    let caretWidth = 6
    let handleRadius = 6
    let selectedHitPadding = 30

    return (
      <Group x={x} y={y}  height={height} rotation={rotation} {...{onMouseOver, onMouseOut, onMouseMove, onMouseUp: e => onMouseUp(planting, e), onKeyDown}}>
        {isSelected &&
          <Group>
            <Rectangle x={-selectedHitPadding} y={-selectedHitPadding} width={width+selectedHitPadding*2} height={height+selectedHitPadding*2} {...{...styles.hitBox}} />
            <Rectangle x={-caretWidth} y={-caretWidth} width={width+caretWidth*2} height={height+caretWidth*2} {...{...styles.caret}} />
            <Circle x={width/2} y={-caretWidth} radius={handleRadius} {...{...styles.handle}} cursor="row-resize" onMouseDown={e => onScale(planting._id, 1, e)} />
            <Circle x={width+caretWidth} y={height/2} radius={handleRadius} {...{...styles.handle}} cursor="col-resize" onMouseDown={e => onScale(planting._id, 2, e)} />
            <Circle x={width/2} y={height+caretWidth} radius={handleRadius} {...{...styles.handle}} cursor="row-resize" onMouseDown={e => onScale(planting._id, 3, e)} />
            <Circle x={-caretWidth} y={height/2} radius={handleRadius} {...{...styles.handle}} cursor="col-resize" onMouseDown={e => onScale(planting._id, 4, e)} />
          </Group>
        }
        <Rectangle width={width*progress} height={6} {...{...styles.progress}}/>
        <Rectangle x={0} y={0} width={width} height={height} {...{...styles.body}} onMouseDown={e => onTranslate(planting._id, e)} cursor={isSelected ? 'move' : 'pointer'} />
        <Text {...{...styles.label}}>{name} {x} {y}</Text>
      </Group>
    )
  }

}
