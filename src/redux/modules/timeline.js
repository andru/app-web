import { createAction, handleActions } from 'redux-actions'

// ------------------------------------
// Constants
// ------------------------------------
export const FILTER_ROWS = 'FILTER_ROWS'

// ------------------------------------
// Actions
// ------------------------------------
export const filter = createAction(FILTER_ROWS, (value = 1) => value)

export const actions = {
  filter
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [FILTER_ROWS]: (state, { payload }) => state + payload
}, 1)
