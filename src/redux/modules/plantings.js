import { createAction, handleActions } from 'redux-actions'
import _ from 'lodash'

import { createSelector } from 'reselect'
import { selectPlaces } from './places'
import { selectPlants } from './plants'

// ------------------------------------
// Constants
// ------------------------------------
//
export const SHOW_CREATE_PLANTING_UI = 'createPlantingUI'
/*
export const SHOW_CREATE_EVENT_UI = 'createEventUI'
export const UPDATE_EVENT = 'updateEvent'
export const EDIT_EVENT_UI = 'editEventUI'
export const SAVE_EDIT_EVENT_UI = 'saveEditEventUI'
export const CLOSE_EDIT_EVENT_UI = 'closeEditEventUI'
export const CANCEL_EDIT_EVENT = 'cancelEditEventUI'

export const TRASH_EVENT = 'trashEvent'
export const UPDATE_EVENT = 'updateEvent'
export const ADD_TIMELINE_EVENT = 'addTimelineEvent'
    */

export const SET_PLANTING_EVENT_DATE = 'SET_PLANTING_EVENT_DATE'
export const SET_PLANTING_EVENT = 'SET_PLANTING_EVENT'

export const TRASH_PLANTING = 'TRASH_PLANTING'

export const CREATE_PLANTING = 'create' //create a new planting document
export const UPDATE_PLANTING = 'update' //updating a planting document
export const DESTROY_PLANTING = 'destroy' //permanently destroy a planting document



// ------------------------------------
// Actions
// ------------------------------------
export const addPlanting = createAction(SHOW_CREATE_PLANTING_UI, () => value)
export const setPlantingEvent = createAction(SET_PLANTING_EVENT)
export const setPlantingEventDate = createAction(SET_PLANTING_EVENT_DATE)


export const actions = {
  setPlantingEventDate
}

// ------------------------------------
// Reducer
// ------------------------------------

function showPlantingUI (state) {
	    return state
}


export function handleSetPlantingEvent (state, {payload}) {
  const { plantingId, eventIndex, eventData } = payload

  let newState = {...state}
  newState[plantingId] = {
    ...state[plantingId],
    timeline: state[plantingId].timeline.slice(0, eventIndex)
      .concat(eventData)
      .concat(state[plantingId].timeline.slice(eventIndex + 1))
  }
  return newState
}

function handleSetPlantingEventDate (state, {payload}) {
  // console.log('setPlantingEventDate', state, payload, arguments)
  const { plantingId, eventIndex, date, dateType } = payload
  // return (
  //   {
  //     ...state,
  //     {[plantingId]: {
  //       ...state[plantingId],
  //       timeline: state[plantingId].timeline.slice(0, eventIndex)
  //         .concat({...state[plantingId].timeline[eventIndex], actualDate: date})
  //         .concat(state[plantingId].timeline.slice(eventIndex+1))
  //       }
  //     }
  //   }
  // )

  let newState = {...state}
  newState[plantingId] = {
    ...state[plantingId],
    timeline: state[plantingId].timeline.slice(0, eventIndex)
      .concat({...state[plantingId].timeline[eventIndex], actualDate: date})
      .concat(state[plantingId].timeline.slice(eventIndex + 1))
  }
  return newState
}

export const reducer = handleActions({
  [SHOW_CREATE_PLANTING_UI]: showPlantingUI,
  [SET_PLANTING_EVENT_DATE]: handleSetPlantingEventDate
}, [])



// ------------------------------------
// Selectors
// ------------------------------------

export function selectPlantings (state) {
  return state.plantings
}
// select plantings which have been trashed
export const selectTrashedPlantings = createSelector(
  selectPlantings,
  (plantings) => {
    let trashed = _.filter(plantings, p => !!p.isTrashed)
    return _.zipObject(
      trashed.map(p => p.id),
      trashed
    )
  }
)
// select plantings which have not been trashed
export const selectActivePlantings = createSelector(
  selectPlantings,
  (plantings) => {
    let trashed = _.filter(plantings, p => !p.isTrashed)
    return _.zipObject(
      trashed.map(p => p.id),
      trashed
    )
  }
)
 
// select plantings which are active for the current date
// export const selectCurrentPlantings = createSelector(
//   selectCurrentDate,
//   selectActivePlantings,
//   (plantings) => {
//     return plantings.filter()
//   }
// )

export const selector = createSelector(
  selectPlantings,
  selectTrashedPlantings,
  selectActivePlantings,
  (plantings, trashedPlantings, activePlantings, places, plants) => ({
    plantings, trashedPlantings, activePlantings
  })
)
