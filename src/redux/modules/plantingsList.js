import { createAction, handleActions } from 'redux-actions'
// import _ from 'lodash'
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
export const SET_SELECTED_EVENT = 'setSelectedEvent'
export const SHOW_EDIT_EVENT_UI = 'showEditEventUI'
export const HIDE_EDIT_EVENT_UI = 'hideEditEventUI'
export const EDIT_EVENT = 'editEvent'

// ------------------------------------
// Actions
// ------------------------------------
export const setSelectedPlanting = createAction(SET_SELECTED_PLANTING, (value) => {
  routeActions.replace(`/plantings/${value.id}`)
  return value
})

export const setSelectedEvent = createAction(SET_SELECTED_EVENT, (value) => {
  routeActions.replace(`/plantings/${value.id}/${value.index}`)
  return value
})

export const showEditEventUI = createAction(SHOW_EDIT_EVENT_UI, (value) => {
  // routeActions.replace(`/plantings/${value}`)
  return value
})

export const hideEditEventUI = createAction(HIDE_EDIT_EVENT_UI, (value) => {
  // routeActions.replace(`/plantings/${value}`)
  return value
})

export const editEvent = createAction(EDIT_EVENT, (value) => {
  // routeActions.replace(`/plantings/${value}`)
  return value
})

export const actions = {
  setSelectedPlanting,
  setSelectedEvent,
  showEditEventUI,
  hideEditEventUI,
  editEvent
}

// ------------------------------------
// Reducer
// ------------------------------------

function handleSetSelectedPlanting (state, {payload}) {
  return {
    ...state,
    selectedPlantingId: payload.id,
    selectedEventIndex: undefined,
    isEditingEvent: false
  }
}

function handleSetSelectedEvent (state, {payload}) {
  return {
    ...state,
    selectedEventIndex: payload.eventIndex
  }
}

function handleShowEditEventUI (state, {payload}) {
  return {
    ...state,
    selectedEventIndex: payload.eventIndex,
    isEditingEvent: true
  }
}

function handleHideEditEventUI (state, {payload}) {
  return {
    ...state,
    selectedEventIndex: undefined,
    isEditingEvent: false
  }
}

function handleEditEvent (state, {payload}) {
  // call event on plantings module...?
  return state
}

export const reducer = handleActions({
  [SET_SELECTED_PLANTING]: handleSetSelectedPlanting,
  [SET_SELECTED_EVENT]: handleSetSelectedEvent,
  [SHOW_EDIT_EVENT_UI]: handleShowEditEventUI,
  [HIDE_EDIT_EVENT_UI]: handleHideEditEventUI,
  [EDIT_EVENT]: handleEditEvent
}, {
  selectedPlantingId: undefined,
  selectedEventIndex: undefined,
  isEditingEvent: false
})

// ------------------------------------
// Selectors
// ------------------------------------
export function selectViewState (state) {
  return state.plantingsList
}

export const selectSelectedPlantingId = createSelector(
  selectViewState,
  (state) => {
    return state.selectedPlantingId
  }
)

export const selectSelectedPlanting = createSelector(
  selectSelectedPlantingId,
  selectPlantings,
  (id, plantings) => {
    return plantings.get(id)
  }
)

export const selectSelectedEvent = createSelector(
  selectSelectedPlanting,
  (state) => selectViewState(state).selectedEventIndex,
  (planting, eventIndex) => planting && planting.timeline[eventIndex] || undefined
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
  selectViewState,
  selectSelectedPlanting,
  selectSelectedEvent,
  selectLogData,
  (
    plantings,
    trashedPlantings,
    activePlantings,
    places,
    plants,
    viewState,
    selectedPlanting,
    selectedEvent,
    logData
  ) => ({
    plantings,
    trashedPlantings,
    activePlantings,
    places,
    plants,
    viewState,
    selectedPlanting,
    selectedEvent,
    logData
  })
)
