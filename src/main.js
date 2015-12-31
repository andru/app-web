import React from 'react'
import { render } from 'react-native-web'
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { syncReduxAndRouter } from 'redux-simple-router'
import routes from './routes'
import Root from './containers/Root'
import configureStore from './redux/configureStore'
import Hoodie from 'hoodie-client'

const history = createBrowserHistory()
const store = configureStore(require('./initialDevState.json'))

syncReduxAndRouter(history, store, (state) => state.router)

// Render the React application to the DOM
render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('root')
)
