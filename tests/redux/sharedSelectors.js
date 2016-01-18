import {test} from 'tape'
import {selectPlantings, selectPlants, selectPlaces} from 'redux/modules/sharedSelectors'

let state = {plantings: [1,2,3], places:[4,5,6], plants:[7,8,9]}
let stateCopy = Object.assign({}, state)

test('selectPlantings', function (t) {
    t.plan(2)
    t.equal(selectPlantings(state), state.plantings, 'should return plantings from the state object')
    t.deepEqual(stateCopy, state, 'should not mutate the state object')
})

test('selectPlaces', function (t) {
    t.plan(2)
    t.equal(selectPlaces(state), state.places, 'should return places from the state object')
    t.deepEqual(stateCopy, state, 'should not mutate the state object')
})

test('selectPlants', function (t) {
    t.plan(2)
    t.equal(selectPlants(state), state.plants, 'should return plants from the state object')
    t.deepEqual(stateCopy, state, 'should not mutate the state object')
})