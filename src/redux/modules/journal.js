import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import moment from 'moment'

import {selectPlantings, selectActivePlantings} from './plantings'
import {selectPlants} from './plants'
import {selectPlaces} from './places'


// ------------------------------------
// Constants
// ------------------------------------
export const SET_TYPE_FILTER = 'SET_TYPE_FILTER'
export const SET_ACTIVE_PLANTING = 'SET_ACTIVE_PLANTING'


// ------------------------------------
// Actions
// ------------------------------------
export const filter = createAction(SET_TYPE_FILTER, (value = 1) => value)

export const setActivePlanting = createAction(SET_ACTIVE_PLANTING, (plantingId) => plantingId)


export const actions = {
  filter
}

// ------------------------------------
// Reducer
// ------------------------------------

export function handleSetActivePlanting (state, payload) {
  return {...state, ...{activePlantingId: payload.plantingId}}
}

export const reducer = handleActions({
  [SET_TYPE_FILTER]: (state, { payload }) => state + payload,
  [SET_ACTIVE_PLANTING]: handleSetActivePlanting
}, {})

// ------------------------------------
// Selector
// ------------------------------------

export function selectActivePlanting (state) {
  return state.journal.activePlantingId || undefined
}

export function selectOptions (state) {
  return state.journal.options || {
    groupBy: 'month'
  }
}

export const selectLogData = createSelector(
  selectPlantings,
  selectPlants,
  selectPlaces,
  selectActivePlantings,
  selectOptions,
  (plantings, plants, places, activePlantingId, options) => {

  }
)

export const selector = createSelector(
  selectPlantings,
  selectPlants,
  selectPlaces,
  selectLogData,
  (plantings, plants, places, logData) => ({
    plantings, plants, places, logData
  })
)
