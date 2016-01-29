import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'
import { routeActions } from 'redux-simple-router'

import { createSelector } from 'reselect'
import { selectPlaces } from './places'
import { selectPlants } from './plants'
import {
  selectPlantings,
  selectActivePlantings,
  selectTrashedPlantings
} from './plantings'
import {
  formatPlantingForLog
} from 'utils/plantings'
// ------------------------------------
// Constants
// ------------------------------------
//
export const SET_SELECTED_PLANTING = 'setSelectedPlanting'


// ------------------------------------
// Actions
// ------------------------------------
export const setSelectedPlanting = createAction(SET_SELECTED_PLANTING, (value) => {
  routeActions.replace(`/plantings/${value}`)
  return value
})


export const actions = {
  setSelectedPlanting
}

// ------------------------------------
// Reducer
// ------------------------------------

function handleSetSelectedPlanting (state, {payload}) {
  return {...state, selectedPlantingId: payload.id}
}

export const reducer = handleActions({
  [SET_SELECTED_PLANTING]: handleSetSelectedPlanting
}, {
  selectedPlantingId: undefined
})



// ------------------------------------
// Selectors
// ------------------------------------
export function selectPlantingListState (state) {
  return state.plantingsList
}

export const selectSelectedPlantingId = createSelector(
  selectPlantingListState,
  (state) => {
    return state.selectedPlantingId
  }
)

export const selectSelectedPlanting = createSelector(
  selectSelectedPlantingId,
  selectPlantings,
  (id, plantings) => {
    return plantings[id]
  }
)

export const selectLogData = createSelector(
  selectPlants,
  selectPlaces,
  selectSelectedPlanting,
  (plants, places, planting) => {
    return planting ? formatPlantingForLog(plants, places, planting) : undefined
  }
)

export const selector = createSelector(
  selectPlantings,
  selectTrashedPlantings,
  selectActivePlantings,
  selectPlaces,
  selectPlants,
  selectSelectedPlanting,
  selectLogData,
  (plantings, trashedPlantings, activePlantings, places, plants, selectedPlanting, logData) => ({
    plantings, trashedPlantings, activePlantings, places, plants, selectedPlanting, logData
  })
)
