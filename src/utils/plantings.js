import {earliest, latest} from './reduce.js'

// return the date of a planting event, not caring whether it's
// an estimate of an actual date
// returns a Date object or an Array of Date objects for a date range
export function getDate (event) {
  return event.eventType === 'period'
    ? (event.actualDateRange || event.estimateDateRange).map(string => new Date(string))
    : new Date(event.actualDate || event.estimateDate)
}

// get the earliest date for an event
// returns a Date object
export function getEarliestDate (event) {
  return event.eventType === 'period'
    ? getDate(event)[0]
    : getDate(event)
}

// get the latest defined date for an event
// returns a Date object
export function getLatestDate (event) {
  return event.eventType === 'period'
    ? getDate(event)[1]
    : getDate(event)
}

// get the latest date from a timeline of Planting Events
// returns a Date object
export function getLatestTimelineDate (timeline) {
  return timeline.map(event => getLatestDate(event)).reduce(latest)
}

// check whether an event is an estimate or actual
export function isEstimate (event) {
  return (event.actualDate || event.actualDateRange)
}
