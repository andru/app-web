import React from 'react'
import {storiesOf, action} from '@kadira/storybook'
import {DatePicker} from '../'
import {wrap} from './_utils'

let theDate = new Date('1985-02-11')

function setDate (date) {
  theDate = date
}

storiesOf('Fatty.DatePicker', module)
  .add('unfilled', () => {
    let isSet = false
    return (
      wrap(<DatePicker label="Choose a date" date={isSet ? theDate : undefined} onChange={date => {
        isSet = true
        setDate(date)
        }} />)
    )
  })
  .add('prefilled', () => (
    wrap(<DatePicker label="Prefilled date" date={theDate} onChange={setDate} />)
  ))
  .add('without day name', () => (
    wrap(<DatePicker label="Showing day name" date={theDate} showDayName={false} onChange={setDate} />)
  ))
  .add('always uncollapsed', () => (
    wrap(<DatePicker label="Always Uncollapsed" date={theDate} collapse={false} onChange={setDate} />)
  ))
  .add('compact', () => (
    wrap(<div style={{width:200}}>
      <DatePicker label="Compact with day name" date={theDate} onChange={setDate} />
    </div>)
  ))
