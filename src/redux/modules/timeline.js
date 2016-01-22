import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import _ from 'lodash'
import moment from 'moment'

import {
  getEventDate,
  getEarliestEventDate,
  getLatestEventDate,
  getLatestTimelineDate,
  isEstimate} from 'utils/plantings.js'

import {selectPlantings} from './plantings'
import {selectPlants} from './plants'
import {selectPlaces} from './places'

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

let last = _.last


function addLine (lines = [], line) {
  // extend the previous line if the new line is of the same type
  lines.length
    ? last(lines).appearance === line.appearance
      ? lines[lines.length - 1] = {...last(lines), to: line.to}
      : lines.push(line)
    : lines.push(line)

  return lines
}

const getPlaceId = timeline => timeline && timeline.length && timeline.reduceRight((placeId, ev) => placeId || ev.placeId, undefined)

export const selectTimelineData = createSelector(
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
      let earliest = getEarliestEventDate(p.timeline[0])
      let latest = getLatestEventDate(last(p.timeline))
      return (
        earliest > start_date && earliest < end_date ||
        earliest < start_date && latest > end_date ||
        latest > start_date && latest < end_date
      )
    })
    // create an object that the timeline can use
    .map(({name, id, plantId, placeId, timeline}) => {
      let track = {
        from: getEarliestEventDate(timeline),
        to: getLatestEventDate(last(timeline)),
        plantingId: id,
        placeId: getPlaceId(timeline),
        plantId,
        name,
        lines: timeline.reduce((accum, ev) => {
          if (accum.previousEvent === undefined) {
            accum.previousEvent = ev
            return accum
          }

          let earliestDate = getEarliestEventDate(ev)
          let latestDate = getLatestEventDate(ev)
          let previousEventDate = getLatestEventDate(accum.previousEvent)

          if (isEstimate(accum.previousEvent) && isEstimate(ev)) {

            addLine(accum.lines, {
              from: previousEventDate,
              to: earliestDate,
              appearance: 'dashed'
            })
            // if the event is a range/period, draw a line between the two dates
            if (!moment(latestDate).isSame(earliestDate)) {

              // draw a dotted line between the two range dates if the latter is undefined...
              if (ev.estimateDateRange[1] === undefined) {
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
            date:getEventDate(e)
          })
        ),
        periods: timeline
          .map((e, eventIndex) => Object.assign(e, {eventIndex}))
          .filter(e => e.eventType === 'period')
          .map(e => ({
            ...e,
            from: getEarliestEventDate(e),
            to: getLatestEventDate(e),
          })
        ),
        styles: {}
      }

      if (plants[track.plantId].appTheme) {
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
          from: getLatestEventDate(last(timeline)),
          to: undefinedEndDate,
          appearance: 'dashed'
        })
      }

      return track
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
