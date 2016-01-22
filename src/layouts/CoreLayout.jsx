import React from 'react'

import NavBar from 'components/NavBar'
import { Button, ButtonPanel } from 'components/Buttons'

import View, { Cover } from 'components/View'

require('static/css/App.css')

function CoreLayout ({children}) {
	let showTopNav = true
		, isDemo = false
  return (
  <Cover className="App-main">
    <Cover className="fullWrap App-mainPanelSplit">
      {showTopNav && <NavBar />}
      {children}
      {isDemo &&
       <ButtonPanel>
         <Button align="right" label={this.l10n('Onboarding-demo-exitButton')} />
       </ButtonPanel>}
    </Cover>
  </Cover>
  )
}

CoreLayout.propTypes = {
  children: React.PropTypes.element
}

export default CoreLayout
