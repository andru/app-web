import React from 'react'
import View from 'components/View'

import BaseEvent from './BaseEvent'

export default class TransplantEvent extends BaseEvent {

  render () {
    const {eventData} = this.props

    const recipientLabels = {
      earth: this.props.l10n('Plant.Recipient.Earth'),
      tray: this.props.l10n('Plant.Recipient.Tray'),
      modules: this.props.l10n('Plant.Recipient.Modules'),
      pot: this.props.l10n('Plant.Recipient.Pots'),
      other: this.props.l10n('Plant.Recipient.Other')
    }

    return (
      <View>
        <View>Transplant to {eventData.placeId}</View>
        <View>{recipientLabels[eventData.recipient]}</View>
      </View>
    )
  }

}
