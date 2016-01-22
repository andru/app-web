import {test} from 'tape'
import Immutable from 'immutable'
import moment from 'moment'

import {
  getEventDate, 
  getLatestTimelineDate
} from 'utils/plantings.js'

import {
  // action handlers
  handleSetActivePlanting,
  // selectors
  selectLogData
} from 'redux/modules/journal'

const plantings = Object.freeze(require('../../fixtures/plantings.json'))
const places = Object.freeze(require('../../fixtures/places.json'))
const plants = Object.freeze(require('../../fixtures/plants.json'))
const journal = Object.freeze({
  activePlantingId: 'planting/one'
})

const state = {plantings, places, plants, journal}
const stateCopy = Object.freeze(Object.assign({}, state))

test('handleSetActivePlanting', function (t) {
    t.plan(2)

    const activePlantingId = 'planting/one'
    const payload = {plantingId: activePlantingId}
    const plantingsCopy = {...plantings}

    const newPlantings = handleSetActivePlanting(
      plantingsCopy,
      payload
    )

    t.equal(newPlantings.journal.activePlantingId, activePlantingId,
      'sets state.journal.activePlantingId to value of payload.plantingId'
    )

    t.throws(handleSetActivePlanting(plantingsCopy),
      'throws error if payload doesn\'t contain plantingId'
    )

    t.deepEqual(plantingsCopy, plantings, 
      'must not mutate state')

});

test('selectLogData', function (t) {
    t.plan(4)

    const activePlantingId = 'planting/one'
    const _pl = plantings[activePlantingId]
    const _tl = _pl.timeline.slice().filter(e => e.eventType==='activity')

    const expectedData = {
      range: [moment(getEventDate(_pl.timeline[0])).startOf('month'), moment(getEventDate(_.last(_pl.timeline))).endOf('month')],
      months: [
        {
          month: moment(getEventDate(_pl.timeline[0])).startOf('month'),
          events: [
            _pl.timeline[0]
          ]
        },
        {
          month: moment(getEventDate(_pl.timeline[1])).startOf('month'),
          events: [
            _pl.timeline[1]
          ]
        },
        // timeline[3 is a period event so it's skipped]
        {
          month: moment(getEventDate(_pl.timeline[3])).startOf('month'),
          events: [
            _pl.timeline[3]
          ]
        }
      ]
    }

    // selectLogData expects an active planting
    let logState = { 
      ...state, 
      ...{
        ...{
          ...state.journal,
          ...{
            activePlantingId
          }
        }
      }
    }

    const logDataWithoutActivePlanting = selectLogData(state)
    const logData = selectLogData(logState)

    t.equal( logDataWithoutActivePlanting, false,
      'returns false if there is no active planting')

    t.deepEqual(logData.range, expectedData.range,
      'defines the start and end date range')

    t.assert(
      logData.months[0].events.length === expectedData.months[0].events.length
        && logData.months[1].events.length === expectedData.months[1].events.length
        && logData.months[2].events.length === expectedData.months[2].events.length,
      'grabs all single-date events from timeline'
      )

    t.deepEqual(stateCopy, logState, 
      'must not mutate state')

});