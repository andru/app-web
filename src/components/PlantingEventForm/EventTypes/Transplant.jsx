import React, {Component, PropTypes} from 'react'
import View, { Cover } from 'components/View'
import Immutable from 'immutable'
import _ from 'lodash'

import Fatty from 'components/Fatty'

import BaseEvent from './BaseEvent'

export default class TransplantEvent extends BaseEvent{

	render () {
		const {eventData, places} = this.props

		const placeNames = this.getStore('place').getAll().map(place=>{
			return {value: place.get('_id'), text:this.format(place, 'name')}
		}).toArray();

		var recipientOptions = [
			{value: 'earth', text: this.props.l10n('Transplant.recipient-option-earth')},
			{value: 'tray', text: this.props.l10n('Transplant.recipient-option-tray')},
			{value: 'modules', text: this.props.l10n('Transplant.recipient-option-modules')},
			{value: 'pot', text: this.props.l10n('Transplant.recipient-option-pots')},
			{value: 'other', text: this.props.l10n('Transplant.recipient-option-other')}
		]

		return (
			<View>
				<Fatty.Dropdown 
				data={ _.sortBy(placeNames, 'text') } 
				label={this.props.l10n('Transplant.placeField-label', eventData.toJS())}
				hint={this.props.l10n('Transplant.placeField-hint', eventData.toJS())}
				value={eventData.get('place_id')}
				onChange={item=>this.updateField('place_id', item.value)} />

				<Fatty.Pills
				data={recipientOptions}
				label={this.props.l10n('Transplant.recipient-label')}
				hint={this.props.l10n('Transplant.recipient-hint')}
				value={eventData.get('recipient')} 
				onChange={value=>this.updateField('recipient', value[0])}	/>
			</View>
		)
	}

}