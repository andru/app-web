import thunk from 'redux-thunk'
import rootReducer from './modules'
import {syncHistory} from 'redux-simple-router'
import {applyMiddleware, compose, combineReducers, createStore} from 'redux'

export default function configureStore (initialState, history) {
  let createStoreWithMiddleware

  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = syncHistory(history)

  const middleware = applyMiddleware(reduxRouterMiddleware, thunk)

  if (__DEBUG__) {
    createStoreWithMiddleware = compose(
      middleware,
      require('containers/DevTools').instrument()
    )
  } else {
    createStoreWithMiddleware = compose(middleware)
  }

  const store = createStoreWithMiddleware(createStore)(
    rootReducer, initialState
  )
  if (__DEBUG__) {
    // Required for replaying actions from devtools to work
    reduxRouterMiddleware.listenForReplays(store)
  }
  if (module.hot) {
    module.hot.accept('./modules', () => {
      const nextRootReducer = require('./modules')

      store.replaceReducer(nextRootReducer)
    })
  }
  return store
}
