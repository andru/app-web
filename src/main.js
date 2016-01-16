import React from 'react'
import {render} from 'react-native-web'
import {createHistory} from 'history'
import routes from './routes'
import Root from './containers/Root'
import configureStore from './redux/configureStore'
import Hoodie from 'hoodie-client'

const history = createHistory()

const store = configureStore(require('./initialDevState.json'), history)

// Render the React application to the DOM
render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('root')
)



