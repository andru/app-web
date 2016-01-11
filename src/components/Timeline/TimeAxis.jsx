import React from 'react'
import TransitionGroup from 'react-addons-css-transition-group'
import {Group, Shape, Text} from 'react-art'
import Rectangle from 'react-art/shapes/rectangle'

const defaultStyles = {
  labels: {
    fontSize: 10,
    fontFamily: 'Museo Sans',
    alignment: "center",
    fill: '#B2B2B2'
  },
  lines: {
  	strokeWidth: 1,
  	stroke: '#fff'
  }
}

export default class TimeAxis extends React.Component {
  static propTypes = {
    styles: React.PropTypes.object,

  }

  static defaultProps = {
    styles: defaultStyles,
    topGutterHeight: 20
  }

  componentDidMount(){
   // var width = this.refs.svg.offsetWidth;
  }

  render () {
    const {ticks, plotX, format, topGutterHeight, styles} = this.props

    return (
        <Group x={0} y={0}>
        {ticks
          .map( date => ({date, xPos:plotX(date)}) )
          .map( ({date, xPos}) => <Group key={date}>
            <Shape d={`M ${xPos},${topGutterHeight} L ${xPos},${1000}`} {...{...defaultStyles.lines, ...styles.lines}} />
            <Text x={xPos} {...{...defaultStyles.labels, ...styles.labels}}>{format(date)}</Text>
          </Group> )
        }
        </Group>
    )
  }
}

