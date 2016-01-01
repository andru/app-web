import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
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
export const CREATE_PLANTING = 'create' //create a new planting document
export const UPDATE_PLANTING = 'update' //updating a planting document
export const DESTROY_PLANTING = 'destroy' //permanently destroy a planting document



// ------------------------------------
// Actions
// ------------------------------------
export const addPlanting = createAction(SHOW_CREATE_PLANTING_UI, () => value)



export const actions = {
  addPlanting
}

// ------------------------------------
// Reducer
// ------------------------------------
//  

function showPlantingUI(state){
	return state;
}

export default handleActions({
  [SHOW_CREATE_PLANTING_UI]: showPlantingUI
}, 1)