import React from 'react'
import { storiesOf, action } from '@kadira/storybook'
import Panelled, {Panel, Tab, TabSpacer} from '../'

const pad = (content) => <div style={{padding:10}}>{content}</div>

storiesOf('Panelled', module)
  .add('No panels', () => (
    <Panelled />
  ))
  .add('Single panel', () => (
    <Panelled>
      <Panel label="Only Panel">This is the only panel</Panel>
    </Panelled>
  ))
  .add('Multiple panels', () => (
    <Panelled>
      <Panel label="Um">{pad('Content for the first panel')}</Panel>
      <Panel label="Dous">{pad('This is the second panel')}</Panel>
      <Panel label="Tres">{pad('Isto é a terceira panel')}</Panel>
      <Panel label="Derradeira">{pad('Pois sim')}</Panel>
    </Panelled>
  ))
  .add('Tab spacer', () => (
    <Panelled>
      <Panel label="Um">{pad('Content for the first panel')}</Panel>
      <Panel label="Dous">{pad('This is the second panel')}</Panel>
      <TabSpacer />
      <Panel label="Tres">{pad('Isto é a terceira panel')}</Panel>
      <TabSpacer />
      <Panel label="Derradeira">{pad('Pois sim')}</Panel>
    </Panelled>
  ))
  .add('Tab component', () => (
    <Panelled>
      <Panel label="Um">{pad('Content for the first panel')}</Panel>
      <Panel label="Dous">{pad('This is the second panel')}</Panel>
      <Panel label="Tres">{pad('Isto é a terceira panel')}</Panel>
      <TabSpacer />
      <Panel tabComponent={(props) => (
        <div onClick={props.onSelect} style={{padding: 10}}>
          { props.isSelected ?
            '(>O_o)>' : '<(o_O<)' }
        </div>
      )}>
        {pad('Smile!')}
      </Panel>
    </Panelled>
  ))
