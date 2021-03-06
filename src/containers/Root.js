import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

import {Cover, Row, Col} from 'components/View'

export default class Root extends React.Component {
  static propTypes = {
    history: React.PropTypes.object.isRequired,
    routes: React.PropTypes.element.isRequired,
    store: React.PropTypes.object.isRequired
  };

  get content () {
    return (
      <Router history={this.props.history}>
        {this.props.routes}
      </Router>
    )
  }

  get devTools () {
    if (__DEBUG__) {
      if (__DEBUG_NEW_WINDOW__) {
        require('../redux/utils/createDevToolsWindow')(this.props.store)
      } else {
        const DevTools = require('containers/DevTools')
        return <DevTools />
      }
    }
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <Row>
          {this.content}
          {window.devToolsExtension || this.devTools}
        </Row>
      </Provider>
    )
  }
}
