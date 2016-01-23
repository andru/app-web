import {test} from 'tape'
import Immutable from 'immutable'

import {
  selectPlantings,
  handleSetPlantingEvent
} from 'redux/modules/plantings'

const plantings = Object.freeze(require('../../fixtures/plantings.json'))
const places = Object.freeze(require('../../fixtures/places.json'))
const plants = Object.freeze(require('../../fixtures/plants.json'))

const state = {plantings, places, plants}
const stateCopy = Object.freeze(Object.assign({}, state))

test('selectPlantings', function (t) {
  t.plan(2)

  t.equal(selectPlantings(state), state.plantings, 'should return plantings from the state object')
  t.deepEqual(stateCopy, state, 'should not mutate the state object')
})

test('handleSetPlantingEvent', function (t) {
    t.plan(2)

    const plantingId = 'planting/one'
    const eventIndex = 2
    const eventData = {...plantings[plantingId].timeline[eventIndex], ...{foo: 'bar2'}}
    const payload = {plantingId, eventIndex, eventData}
    const plantingsCopy = {...plantings}

    const newPlantings = handleSetPlantingEvent(
      plantingsCopy,
      {payload}
    )

    t.deepEqual(
      newPlantings[plantingId].timeline[eventIndex],
      eventData,
      'should replace the timeline index with the given event data'
    )

    t.deepEqual(
      plantingsCopy, 
      plantings, 
      'should not mutate the state object')

});