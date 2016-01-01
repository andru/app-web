import React from 'react'
import TransitionGroup from 'react-addons-css-transition-group'

const defaultStyles = {
  labels: {
    fontSize: 12,
    fontFamily: 'Museo Sans',
    textAnchor: "middle"
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
        <g>
        {ticks
          .map( date => ({date, xPos:plotX(date)}) )
          .map( ({date, xPos}) => <g key={date}>
            <line x1={xPos} x2={xPos} y1={topGutterHeight} y2={1000} style={{...defaultStyles.lines, ...styles.lines}} />
            <text x={xPos} style={{...defaultStyles.labels, ...styles.labels}}>{format(date)}</text>
          </g> )
        }
        </g>
    )
  }
}

