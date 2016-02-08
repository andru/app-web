import React from 'react'
import View from 'components/View'

import BaseEvent from './BaseEvent'

export default class PlantEvent extends BaseEvent {

  render () {
    const {eventData} = this.props

    const plantFromOptions = [
      {value: 'seed', text: this.props.l10n('Plant.Material.Seed')},
      {value: 'plantlet', text: this.props.l10n('Plant.Material.Plantlet')},
      {value: 'cutting', text: this.props.l10n('Plant.Material.Cutting')},
      {value: 'tuber', text: this.props.l10n('Plant.Material.Tuber')}
    ]

    const recipientOptions = [
      {value: 'earth', text: this.props.l10n('Plant.Recipient.Earth')},
      {value: 'tray', text: this.props.l10n('Plant.Recipient.Tray')},
      {value: 'modules', text: this.props.l10n('Plant.Recipient.Modules')},
      {value: 'pot', text: this.props.l10n('Plant.Recipient.Pots')},
      {value: 'other', text: this.props.l10n('Plant.Recipient.Other')}
    ]

    return (
      <View>
        <View>Planted in {eventData.placeId}</View>
        <View>Seed Material {eventData.from}</View>
        <View>Planting Environment {eventData.recipient}</View>
      </View>
    )
  }

}
