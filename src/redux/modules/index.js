import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'

import { reducer as plantings } from './plantings'
import { reducer as plants } from './plants'
import { reducer as places } from './places'
import { reducer as timeline } from './timeline'

export default combineReducers({
  // app data
  plantings,
  plants,
  places,

  // views
  timeline,
  routing: routeReducer
})
