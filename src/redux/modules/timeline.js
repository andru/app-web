import { createAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import _ from 'lodash'
import moment from 'moment'

import {
  getEventDate,
  getEarliestEventDate,
  getLatestEventDate,
  getLatestTimelineDate,
  isEstimate,
  isEventDateRange,
  formatPlantingForTimeline
} from 'utils/plantings.js'

import {selectPlantings} from './plantings'
import {selectPlants} from './plants'
import {selectPlaces} from './places'

// ------------------------------------
// Constants
// ------------------------------------
export const FILTER_ROWS = 'FILTER_ROWS'
export const SHOW_EDIT_EVENT_FORM = 'SHOW_EDIT_EVENT_FORM'


// ------------------------------------
// Actions
// ------------------------------------
export const filter = createAction(FILTER_ROWS, (value = 1) => value)
export const showEditEventForm = createAction(SHOW_EDIT_EVENT_FORM, (value = 1) => value)

export const actions = {
  filter,
  showEditEventForm
}

// ------------------------------------
// Reducer
// ------------------------------------
export function handleShowEditEventForm (state, {payload}) {
  return {
    ...state, 
    ...{
      editEventForm: {
        show: true,
        selectedPlantingId: payload.plantingId,
        selectedEventIndex: payload.eventIndex
      }
    }
  }
}
export const reducer = handleActions({
  [FILTER_ROWS]: (state, { payload }) => state + payload,
  [SHOW_EDIT_EVENT_FORM]: handleShowEditEventForm
}, {
  editEventForm: {
    show: false
  }
})

// ------------------------------------
// Selector
// ------------------------------------

export const selectTimelineData = createSelector(
  selectPlantings,
  selectPlants,
  selectPlaces,
  (plantings, plants, places) => {

    let start_date = new Date('2015-01-01')
    let end_date = new Date('2016-01-01')

    return _(plantings)
    // only plantings with a timeline
    .filter(p => p.timeline && p.timeline.length)
    // only plantings that exist within or span the current date range
    .filter(p => {
      let earliest = getEarliestEventDate(p.timeline[0])
      let latest = getLatestEventDate(_.last(p.timeline))
      return (
        earliest > start_date && earliest < end_date ||
        earliest < start_date && latest > end_date ||
        latest > start_date && latest < end_date
      )
    })
    // create an object that the timeline can use
    .map(_.partial(formatPlantingForTimeline, plants, places))
    .groupBy('placeId')
    .map((group, id) => ({name: id, tracks: group}))
    .value()
  }
)

export function selectTimelineState (state) {
  return state.timeline
}

export function selectEditEventForm (state) {
  return state.timeline.editEventForm
}

export const selectEditEventFormData = createSelector(
  selectPlantings,
  selectEditEventForm,
  (plantings, editEventForm) => {
    if (editEventForm.show === true) {
      let eventData = _.cloneDeep(plantings[editEventForm.selectedPlantingId].timeline[editEventForm.selectedEventIndex])
      eventData.date = getEventDate(eventData)
      return eventData
    } else {
      return {}
    }
    
  }
)


export const selector = createSelector(
  selectTimelineData,
  selectEditEventForm,
  selectEditEventFormData,
  (timelineData, editEventForm, editEventFormData) => ({timelineData, editEventForm, editEventFormData})
)
