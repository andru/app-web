
import React, {Component} from 'react'

export default class Planting extends Component {

  render () {
    let { planting, isSelected, setCursor,
          onMouseOver, onMouseOut, onMouseMove, onMouseUp, onKeyDown,
          onTranslate, onScale, onRotate  } = this.props
    let { name, progress, x, y, width, height, rotation } = planting

    if (isSelected){
      // console.log('rendering planting', planting.x, planting.y, planting.width, planting.height, planting);
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
      resizeHandle: {
        fill: '#F06F68'
      },
      rotateHandle: {
        fill: 'transparent',
        stroke: '#F06F68',
        strokeWidth: 10
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
      <g transform={`translate(${x}, ${y}) rotate(${rotation} ${width/2} ${height/2})`} 
      {...{onMouseOver, onMouseOut, onMouseMove, onMouseUp: e => onMouseUp(planting, e), onKeyDown}}
      ref="container"
      id={planting.id}>
        {isSelected &&
          <g>
            <rect x={-selectedHitPadding} y={-selectedHitPadding} width={width+selectedHitPadding*2} height={height+selectedHitPadding*2} {...{...styles.hitBox}} />
            <circle 
              cx={width/2}
              cy={height/2}
              r={Math.max(width, height)/2}
              {...{...styles.rotateHandle}}
              style={{cursor: 'rotate'}} 
              onMouseDown={e => onRotate(planting.id, e)} />
            <rect 
              x={-caretWidth}
              y={-caretWidth}
              width={width+caretWidth*2}
              height={height+caretWidth*2} 
              {...{...styles.caret}} />
            <circle 
              cx={width/2}
              cy={-caretWidth}
              r={handleRadius}
              {...{...styles.resizeHandle}}
              style={{cursor:'row-resize'}}
              onMouseDown={e => onScale(planting.id, 1, e)} />
            <circle 
              cx={width+caretWidth}
              cy={height/2}
              r={handleRadius}
              {...{...styles.resizeHandle}}
              style={{cursor: 'col-resize'}}
              onMouseDown={e => onScale(planting.id, 2, e)} />
            <circle 
              cx={width/2}
              cy={height+caretWidth}
              r={handleRadius}
              {...{...styles.resizeHandle}}
              style={{cursor: 'row-resize'}}
              onMouseDown={e => onScale(planting.id, 3, e)} />
            <circle 
              cx={-caretWidth}
              cy={height/2} r={handleRadius} 
              {...{...styles.resizeHandle}}
              style={{cursor: 'col-resize'}}
              onMouseDown={e => onScale(planting.id, 4, e)} />
          </g>
        }
        <rect width={width*progress} height={6} {...{...styles.progress}}/>
        <g onMouseDown={e => onTranslate(planting.id, e)} style={{cursor:isSelected ? 'move' : 'pointer'}}>
          <rect x={0} y={0} width={width} height={height} {...{...styles.body}} ref="bodyRect" />
          <text x={4} y={22} {...{...styles.label}}><tspan>{name}</tspan></text>
        </g>
      </g>
    )
  }

}
