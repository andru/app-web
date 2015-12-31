import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'

import counter from './counter'
import plantings from './plantings'
import timeline from './timeline'

export default combineReducers({
  counter,
  plantings,
  timeline,
  router: routeReducer
})
