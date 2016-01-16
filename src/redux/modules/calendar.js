import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import moment from 'moment'

import {selectPlantings, selectPlants, selectPlaces} from './sharedSelectors.js'


// ------------------------------------
// Constants
// ------------------------------------
export const SET_TYPE_FILTER = 'SET_TYPE_FILTER'

// ------------------------------------
// Actions
// ------------------------------------
export const filter = createAction(SET_TYPE_FILTER, (value = 1) => value)

export const actions = {
  filter
}

// ------------------------------------
// Reducer
// ------------------------------------
export const reducer = handleActions({
  [SET_TYPE_FILTER]: (state, { payload }) => state + payload
}, {})

// ------------------------------------
// Selector
// ------------------------------------

export const selector = createSelector(
  selectPlantings,
  selectPlants,
  selectPlaces,
  (plantings, plants, places, timelineData) => ({plantings, plants, places})
)