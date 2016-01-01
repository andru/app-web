import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'

import counter from './counter'
import plantings from './plantings'
import plants from './plants'
import places from './places'
import timeline from './timeline'

export default combineReducers({
  counter,

  // app data
  plantings,
  plants,
  places,

  // views
  timeline,
  router: routeReducer
})
