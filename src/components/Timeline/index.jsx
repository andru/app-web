import React from 'react'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import scale from 'd3-scale'

import {Cover} from 'components/View'

import Track from './Track'
import Line from './Line'
import Marker from './Marker'
import Period from './Period'

export Track from './Track'
export Line from './Line'
export Marker from './Marker'
export Period from './Period'

const defaultStyles = {
  monthLabels: {
    fontSize: 12,
    fontFamily: 'Museo Sans',
    textAnchor: "middle"
  }
}

export default class Timeline extends React.Component {
  static propTypes = {
    from: React.PropTypes.instanceOf(Date).isRequired,
    to: React.PropTypes.instanceOf(Date).isRequired,
    topGutterHeight: React.PropTypes.number
  }

  static defaultProps = {
    height: 30,
    styles: defaultStyles,
    topGutterHeight: 20
  }

  componentDidMount(){
   // var width = this.refs.svg.offsetWidth;
  }

  render () {
    const {children, from, to, height, styles, topGutterHeight} = this.props

    const viewScale = scale.time()
    .domain([from, to])
    .range([0, document.body.clientWidth])
    .nice()

    const timeAxisTicks = viewScale.ticks()

    const plotX = date => viewScale(date.getTime())
    const format = viewScale.tickFormat()

    const newChildren = React.Children.map(children, (child, index) => {
      // if(!child || !child.type)
       // || child.type!==Track)
        // return null;
      return React.cloneElement(child, {plotX, yPos: height*index+topGutterHeight, height});
    }, this);

    return (
      <Cover>
      <svg style={{overflow:'visible',userSelect:'none',width:'100%',height:'100%'}}>
        <g>
        {timeAxisTicks
          .map( date => ({date, xPos:viewScale(date)}) )
          .map( ({date, xPos}) => <g key={date}>
            <line x1={xPos} x2={xPos} y1={topGutterHeight} y2={1000} strokeWidths={1} stroke="#ddd" />
            <text x={xPos} style={{...defaultStyles.monthLabels, ...styles.monthLabels}}>{format(date)}</text>
          </g> )
        }
        </g>
        {newChildren}
      </svg>
      </Cover>
    )
  }
}

