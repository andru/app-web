import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'

// data models
import { reducer as plantings } from './plantings'
import { reducer as plants } from './plants'
import { reducer as places } from './places'

// views
import { reducer as timeline } from './timeline'
import { reducer as journal } from './journal'


export default combineReducers({
  // app data
  plantings,
  plants,
  places,

  // views
  timeline,
  journal,
  routing: routeReducer
})
