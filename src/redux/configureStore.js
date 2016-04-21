import thunk from 'redux-thunk'
import rootReducer, {sagas} from './modules'
import {syncHistory} from 'redux-simple-router'
import {applyMiddleware, compose, combineReducers, createStore} from 'redux'
import createSagaMiddleware from 'redux-saga'

export default function configureStore (initialState, history) {
  let createStoreWithMiddleware

  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = syncHistory(history)

  const middleware = applyMiddleware(
    reduxRouterMiddleware,
    thunk,
    createSagaMiddleware(...sagas)
  )

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
