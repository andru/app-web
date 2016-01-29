import React, {Component, PropTypes} from 'react'
import View, { Cover } from 'components/View'
import _ from 'lodash'

import BaseEvent from './BaseEvent'

export default class GenericEvent extends BaseEvent{
  
  render () {
    const {eventData} = this.props;
    return (
      <View>No renderer defined for {eventData.eventType} events</View> 
    )
  }

}