import {earliest, latest} from './reduce.js'

export function coerceToDate (date) {
  return date instanceof Date ? date : new Date(date)
}

// return the date of a planting event, not caring whether it's
// an estimate of an actual date
// returns a Date object or an Array of Date objects for a date range
export function getEventDate (event) {
  return event.eventType === 'period'
    ? (event.actualDateRange || event.estimateDateRange).map(coerceToDate)
    : coerceToDate(event.actualDate || event.estimateDate)
}

// get the earliest date for an event
// returns a Date object
export function getEarliestEventDate (event) {
  return event.eventType === 'period'
    ? getEventDate(event)[0]
    : getEventDate(event)
}

// get the latest defined date for an event
// returns a Date object
export function getLatestEventDate (event) {
  return event.eventType === 'period'
    ? getEventDate(event)[1]
    : getEventDate(event)
}

// get the latest date from a timeline of Planting Events
// returns a Date object
export function getLatestTimelineDate (timeline) {
  return timeline.map(event => getLatestEventDate(event)).reduce(latest)
}

// check whether an event is an estimate or actual
export function isEstimate (event) {
  return (event.actualDate || event.actualDateRange)
}
