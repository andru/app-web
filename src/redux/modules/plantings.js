import { createAction, handleActions } from 'redux-actions'

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
export const CREATE_PLANTING = 'create' //create a new planting document
export const UPDATE_PLANTING = 'update' //updating a planting document
export const DESTROY_PLANTING = 'destroy' //permanently destroy a planting document



// ------------------------------------
// Actions
// ------------------------------------
export const addPlanting = createAction(SHOW_CREATE_PLANTING_UI, () => value)
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
      .concat(state[plantingId].timeline.slice(eventIndex+1))
  }
  return newState
}

export const reducer = handleActions({
  [SHOW_CREATE_PLANTING_UI]: showPlantingUI,
  [SET_PLANTING_EVENT_DATE]: handleSetPlantingEventDate
}, [])
