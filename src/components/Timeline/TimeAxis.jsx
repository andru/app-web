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
  };

  static defaultProps = {
    styles: defaultStyles,
    topGutterHeight: 20
  };

  componentDidMount(){
   // var width = this.refs.svg.offsetWidth;
  }

  render () {
    const {ticks, plotX, format, topGutterHeight, styles} = this.props
    const textYPos = 15

    const children = ticks.map( (date, i) => {
      const xPos = plotX(date)
      const width = i === ticks.length-1
        ? xPos - plotX(ticks[i-1])
        : plotX(ticks[i+1]) - xPos
      return (
        <g key={date}>
          <line x1={xPos} x2={xPos} y1={topGutterHeight} y2={1000} style={{...defaultStyles.lines, ...styles.lines}} />
          <text x={xPos+width/2} y={textYPos} style={{...defaultStyles.labels, ...styles.labels}}>{format(date)}</text>
        </g>
      )
    })

    return (
      <g>{children}</g>
    )
  }
}
