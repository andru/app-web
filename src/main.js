// require('babel-core/register')
// import "babel-polyfill";

import React from 'react'
import {render} from 'react-native-web'
import {createHistory} from 'history'
import routes from './routes'
import Root from './containers/Root'
import configureStore from './redux/configureStore'
import Hoodie from 'hoodie-client'

import modelArrayToMap from 'utils/modelArrayToMap'

const history = createHistory()

// TODO initialize data from Pouch/Hoodie
const initialState = require('./initialDevState.json')
initialState.plantings = modelArrayToMap(initialState.plantings)
initialState.places = modelArrayToMap(initialState.places)
initialState.plants = modelArrayToMap(initialState.plants)

const store = configureStore(initialState, history)

// Render the React application to the DOM
render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('root')
)
