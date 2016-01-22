import {test} from 'tape'

import {
  getEventDate,
  getEarliestEventDate,
  getLatestEventDate,
  getLatestTimelineDate,
  isEstimate
} from 'utils/plantings'

const estimate = Object.freeze({
  estimateDate: new Date('2015-01-01')
})

const actual = Object.freeze({
  actualDate: new Date('2015-01-01')
})

const estimateRange = Object.freeze({
  eventType: 'period',
  estimateDateRange: [new Date('2015-01-01'), new Date('2015-02-01')]
})

const actualRange = Object.freeze({
  eventType: 'period',
  actualDateRange: [new Date('2015-01-01'), new Date('2015-02-01')]
})

test('getEventDate', function (t) {
  t.plan(6)

  t.equal(
    getEventDate(estimate).toString(),
    estimate.estimateDate.toString(),
    'returns an estimate date'
  )
  t.equal(
    getEventDate(actual).toString(),
    actual.actualDate.toString(),
    'returns an actual date'
  )
  t.equal(
    getEventDate(estimateRange)[0].toString(),
    estimateRange.estimateDateRange[0].toString(),
    'returns start estimateRange date'
  )
  t.equal(
    getEventDate(estimateRange)[1].toString(),
    estimateRange.estimateDateRange[1].toString(),
    'returns end estimateRange date'
  )
  t.equal(
    getEventDate(actualRange)[0].toString(),
    actualRange.actualDateRange[0].toString(),
    'returns start actualRange date'
  )
  t.equal(
    getEventDate(actualRange)[1].toString(),
    actualRange.actualDateRange[1].toString(),
    'returns end actualRange date'
  )
})

test.plan('getEarliestEventDate', function (t) {
  t.plan(4)

  t.equal(
    getEarliestEventDate(estimate).toString(),
    estimate.estimateDate.toString(),
    'returns an estimate date'
  )
  t.equal(
    getEarliestEventDate(actual).toString(),
    actual.actualDate.toString(),
    'returns an actual date'
  )
  t.equal(
    getEarliestEventDate(estimateRange).toString(),
    estimateRange.estimateDateRange[0].toString(),
    'returns start estimateRange date'
  )
  t.equal(
    getEarliestEventDate(actualRange).toString(),
    actualRange.actualDateRange[0].toString(),
    'returns start actualRange date'
  )
})

test.plan('getLatestEventDate', function (t) {
  t.plan(4)

  t.equal(
    getLatestEventDate(estimate).toString(),
    estimate.estimateDate.toString(),
    'returns an estimate date'
  )
  t.equal(
    getLatestEventDate(actual).toString(),
    actual.actualDate.toString(),
    'returns an actual date'
  )
  t.equal(
    getLatestEventDate(estimateRange).toString(),
    estimateRange.estimateDateRange[1].toString(),
    'returns end estimateRange date'
  )
  t.equal(
    getLatestEventDate(actualRange).toString(),
    actualRange.actualDateRange[1].toString(),
    'returns end actualRange date'
  )
})

test.plan('getLatestTimelineDate', function (t) {
  const timelineOne = [
    {actualDate: new Date('2014-01-01')},
    {estimateDate: new Date('2015-04-01')}
  ]
  const timelineTwo = [
    {estimateDate: new Date('2014-01-01')},
    {actualDate: new Date('2015-04-01')}
  ]
  const timelineThree = [
    {estimateDate: new Date('2014-01-01')},
    {
      eventType: 'period',
      estimateDateRange: [new Date('2014-04-01'), new Date('2015-01-01')]
    },
    {estimateDate: new Date('2014-08-01')}

  ]
  t.plan(3)

  t.equal(
    getLatestTimelineDate(timelineOne).toString(),
    timelineOne[1].estimateDate.toString(),
    'returns latest date'
  )
  t.equal(
    getLatestTimelineDate(timelineTwo).toString(),
    timelineTwo[1].actualDate.toString(),
    'returns latest date'
  )
  t.equal(
    getLatestTimelineDate(timelineThree).toString(),
    timelineThree[1].estimateDateRange[1].toString(),
    'returns end date of a range if its the latest date'
  )
})

test.plan('isEstimate', function (t) {
  t.plan(6)

  t.equal(isEstimate(estimate), true,
    'returns true for an estimate date event')
  t.equal(isEstimate(actual), false,
    'returns false for an actual date event')
  t.equal(
    isEstimate({...estimate, ...actual}), false,
    'returns false for an actual date event, regardless of an estimate')
  t.equal(
    isEstimate(estimateRange), true,
    'returns true for an estimate date range event')
  t.equal(
    isEstimate(actualRange), false,
    'returns false for an actual date range event')
  t.equal(
    isEstimate({...estimateRange, ...actualRange}), false,
    'returns false for an actual date range event, regardless of an estimate range')
})
