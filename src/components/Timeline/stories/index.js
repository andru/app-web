import React from 'react'
import {storiesOf, action} from '@kadira/storybook'
import Measure from 'react-measure'

import Timeline from '../'

const fixture = require('./fixture.json')


const wrapStyle = {
  backgroundColor: '#aee',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

function wrap (component, styles = {}) {
  return (
    <div style={{...wrapStyle, ...styles}}>
      {component}
    </div>
  )
}

// array reducer. given an unsorted array of dates, reduce to the earliest
function earliest (earliest, value, i) {
  return value < earliest ? value : earliest
}
// array reducer. given an unsorted array of dates, reduce to the latest
function latest (latest, value, i) {
  return value > latest ? value : latest
}

function getLatestTimelineDate (timeline) {
  return timeline.map(event => getLatestDate(event)).reduce(latest)
}

const from = new Date("2015-01-01")
const to = new Date("2016-06-01")
const height = 500
const width = 500

// unserialize dates from JSON
const data = fixture.map(item => ({
  ...item,
  from: new Date(item.from),
  to: new Date(item.to),
  tracks: item.tracks.map(track => ({
    ...track,
    markers: track.markers.map(m => ({...m, date: new Date(m.date)})),
    periods: track.periods.map(p => ({...p, from: new Date(p.from), to: new Date(p.to)})),
    lines: track.lines.map(l => ({...l, from: new Date(l.from), to: new Date(l.to)}))
  }))
}))

storiesOf('Timeline', module)
.add('with data', () => wrap(
      <Timeline
        from={from}
        to={to}
        height={height}
        width={width}
        data={data}
        onMarkerChange={action('onMarkerChange')}
        onMarkerEditIntent={action('onMarkerEditIntent')}
        onDateRangeChange={action('onDateRangeChange')}
        styles={{svg: {overflow: 'hidden', flex: 'initial'}}}
      />
))
