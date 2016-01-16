import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import moment from 'moment'

// ------------------------------------
// Constants
// ------------------------------------
export const FILTER_ROWS = 'FILTER_ROWS'

// ------------------------------------
// Actions
// ------------------------------------
export const filter = createAction(FILTER_ROWS, (value = 1) => value)

export const actions = {
  filter
}

// ------------------------------------
// Reducer
// ------------------------------------
export const reducer = handleActions({
  [FILTER_ROWS]: (state, { payload }) => state + payload
}, {})

// ------------------------------------
// Selector
// ------------------------------------
function selectPlaces (state) {
  return state.places
}
function selectPlants (state) {
  return state.plants 
}
function selectPlantings (state) {
  return state.plantings
}

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

const getPlaceId = timeline => timeline && timeline.length && timeline.reduceRight((placeId, ev) => placeId || ev.placeId, undefined)

const selectTimelineData = createSelector(
  selectPlantings,
  selectPlants,
  selectPlaces,
  (plantings, plants, places) => {

    let start_date = new Date('2015-01-01')
    let end_date = new Date('2016-01-01')

    return _(plantings)
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
    .map(({name, id, plantId, placeId, timeline}) => {
      let track = {
        from: getEarliestDate(timeline),
        to: getLatestDate(last(timeline)),
        plantingId: id,
        placeId: getPlaceId(timeline),
        plantId,
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
        markers: timeline
          .map((e, eventIndex) => Object.assign(e, {eventIndex}))
          .filter(e => e.eventType === 'activity' || e.eventType === 'lifecycle')
          .map(e => ({
            ...e,
            date:getDate(e)
          }) 
        ),
        periods: timeline
          .map((e, eventIndex) => Object.assign(e, {eventIndex}))
          .filter(e => e.eventType === 'period')
          .map(e => ({
            ...e,
            from: getEarliestDate(e),
            to: getLatestDate(e),
          })
        ),
        styles: {}
      }

      if (plants[track.plantId].appTheme){  
        track.styles.all = {
          stroke: plants[track.plantId].appTheme.timelineColor,
          fill: plants[track.plantId].appTheme.timelineColor
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
    .groupBy('placeId')
    .map((group, id) => ({name: id, tracks: group}))
    .value()
  }
)

export const selector = createSelector(
  selectPlantings,
  selectPlants,
  selectPlaces,
  selectTimelineData,
  (plantings, plants, places, timelineData) => ({plantings, plants, places, timelineData})
)