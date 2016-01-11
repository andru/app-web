import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import Measure from 'react-measure'
import moment from 'moment'
import _ from 'lodash'

import {Cover} from 'components/View'
import Timeline, {TimeAxis, TrackGroup, Track, Line, Period, Marker} from 'components/Timeline'

import { actions as timelineActions } from '../../redux/modules/timeline'

const mapStateToProps = (state) => ({
  plantings: state.plantings,
  plants: state.plants,
  places: state.places,
  ...state.timeline
})

// array reducer. given an unsorted array of dates, reduce to the earliest
function earliest (earliest, value, i) {
  return value < earliest ? value : earliest
}
// array reducer. given an unsorted array of dates, reduce to the latest
function latest (latest, value, i) {
  return value > latest ? value : latest
}
//return the last elemet of an array
function last (arr) {
  return arr[arr.length-1]
}

function getDate (event) {
  return event.eventType === 'period'
    ? (event.actualDateRange || event.estimateDateRange).map(string => new Date(string))
    : new Date(event.actualDate || event.estimateDate)
}

function getEarliestDate (event) {
  return event.eventType === 'period'
    ? getDate(event)[0]
    : getDate(event)
}

function getLatestDate (event) {
  return event.eventType === 'period'
    ? getDate(event)[1]
    : getDate(event)
}

function getLatestTimelineDate (timeline) {
  return timeline.map(event => getLatestDate(event)).reduce(latest)
}

// check whether an event is an estimate or actual
function isEstimate (event) {
  return (event.actualDate || event.actualDateRange)
}

function addLine (lines=[], line) {
  // extend the previous line if the new line is of the same type
  lines.length
    ? last(lines).appearance === line.appearance
      ? lines[lines.length-1] = {...last(lines), to: line.to}
      : lines.push(line)
    : lines.push(line)

  return lines
}

export class TimelineView extends React.Component {
  static propTypes = {
    // counter: React.PropTypes.number.isRequired,
    // doubleAsync: React.PropTypes.func.isRequired,
    // increment: React.PropTypes.func.isRequired
  }

  state = {
    dimensions: {},
    isMounted: false
  }

  componentDidMount = () => {
    setTimeout(() => this.setState({isMounted: true}), 20)
  }

  render () {
    const {plantings, plants, places} = this.props
    const {width, height} = this.state.dimensions

    // const plantingsForTimeline = plantings.filter()
    let start_date = new Date('2015-01-01')
    let end_date = new Date('2016-01-01')


   const getPlaceId = timeline => timeline && timeline.length && timeline.reduceRight((place_id, ev) => place_id || ev.place_id, undefined)
 
    let timelinePlantings = _(this.props.plantings)
    // only plantings with a timeline
    .filter(p => p.timeline && p.timeline.length)
    // only plantings that exist within or span the current date range
    .filter(p => {
      let earliest = getEarliestDate(p.timeline[0])
      let latest = getLatestDate(last(p.timeline))
      return (
        earliest > start_date && earliest < end_date ||
        earliest < start_date && latest > end_date ||
        latest > start_date && latest < end_date
      )
    })
    // create an object that the timeline can use
    .map(({name, plant_id, place_id, timeline}) => {
      let track = {
        from: getEarliestDate(timeline),
        to: getLatestDate(last(timeline)),
        place_id: getPlaceId(timeline),
        plant_id,
        name,
        lines: timeline.reduce((accum, ev) => {
          if (accum.previousEvent===undefined) {
            accum.previousEvent = ev
            return accum
          }

          let earliestDate = getEarliestDate(ev)
          let latestDate = getLatestDate(ev)
          let previousEventDate = getLatestDate(accum.previousEvent)

          if (isEstimate(accum.previousEvent) && isEstimate(ev)) {
            
            addLine(accum.lines, {
              from: previousEventDate,
              to: earliestDate,
              appearance: 'dashed'
            })
            // if the event is a range/period, draw a line between the two dates
            if (!moment(latestDate).isSame(earliestDate)) {
              
              // draw a dotted line between the two range dates if the latter is undefined...
              if (ev.estimateDateRange[1] === undefined){
                addLine(accum.lines, {
                  from: earliestDate,
                  to: latestDate,
                  appearance: 'dashed'
                })
              } else {
                addLine(accum.lines, {
                  from: earliestDate,
                  to: latestDate,
                  appearance: 'solid'
                })
              } 
            }
          } else {
            addLine(accum.lines, {
              from: previousEventDate,
              to: latestDate,
              appearance: 'solid'
            })
          }
          return accum
        }, {
          lines: [],
          previousEvent: undefined
        }).lines,
        markers: timeline.filter(e => e.eventType === 'activity' || e.eventType === 'lifecycle')
          .map(e => ({...e, date:getDate(e)})),
        periods: timeline.filter(e => e.eventType === 'period')
          .map(e => ({
            from: getEarliestDate(e),
            to: getLatestDate(e)
          })
        ),
        styles: {}
      }

      if (plants[track.plant_id].appTheme){  
        track.styles.all = {
          stroke: plants[track.plant_id].appTheme.timelineColor,
          fill: plants[track.plant_id].appTheme.timelineColor
        }
      }

      if (last(timeline).eventType !== 'end') {
        let undefinedEndDate = moment(getLatestTimelineDate(timeline)).add(1, 'month').toDate()
        track.markers.push({ 
          date: undefinedEndDate,
          appearance: 'rightArrow'
        })
        track.lines.push({
          from: getLatestDate(last(timeline)),
          to: undefinedEndDate,
          appearance: 'dashed'
        })
      }

      return track;
    })

    .groupBy('place_id')
    .map((group, id) => ({name: id, tracks: group}))
    .value()

    console.log(timelinePlantings, timelinePlantings[0].tracks[0].periods[0])

    return (
      <Measure
        onMeasure={(dimensions, mutations, target) => {
          console.log('Dimensions: ', dimensions);
          this.setState({dimensions})
        }}>
        <Cover style={{visibility: this.state.isMounted ? 'visible' : 'hidden'}}>
          <Timeline from={start_date} to={end_date} height={height} width={width}>
            <TimeAxis />
            {timelinePlantings.map( ({name, tracks}) => (
              <TrackGroup
              from={tracks.map( ({from}) => from ).reduce(earliest)}
              to={tracks.map( ({to}) => to ).reduce(latest)} >
                {tracks.map(({from, to, lines, periods, markers, styles}, i) =>
                  (<Track from={from} to={to} key={i} styles={styles || {}}>
                    {periods.map( ({from, to}, i) => <Period from={from} to={to} key={i} /> )}

                    {lines.map( ({from, to, appearance}) => <Line from={from} to={to} strokeDash={[10,appearance==='solid'?0:10]} /> )}

                    {markers.map( ({date, appearance}, i) => <Marker date={date} icon={true} key={i} appearance={appearance} /> )}

                  </Track>)
                )}
              </TrackGroup>
            ))}
          </Timeline>
        </Cover>
      </Measure>
    )
  }
}

export default connect(mapStateToProps, timelineActions)(TimelineView)

const styles = StyleSheet.create({
})
