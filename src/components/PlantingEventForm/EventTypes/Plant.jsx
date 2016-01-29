import React, {Component, PropTypes} from 'react'
import View, { Cover } from 'components/View'
import _ from 'lodash'

import Fatty from 'components/Fatty'

import BaseEvent from './BaseEvent'

export default class PlantEvent extends BaseEvent{
	
	render(){
		var 
			eventData = this.props.eventData,
			eventDataObj = this.props.eventData.toJS(),
			places = this.props.places.map(place=>{
				return {value: place.id, text:place.name}
			})
		;

		var plantFromOptions = [
			{value: 'seed', text: this.props.l10n('Plant.material-seed')},
			{value: 'plantlet', text: this.props.l10n('Plant.material-plantlet')},
			{value: 'cutting', text: this.props.l10n('Plant.material-cutting')},
			{value: 'tuber', text: this.props.l10n('Plant.material-tuber')}
		];

		var recipientOptions = [
			{value: 'earth', text: this.props.l10n('Plant.recipient-option-earth')},
			{value: 'tray', text: this.props.l10n('Plant.recipient-option-tray')},
			{value: 'modules', text: this.props.l10n('Plant.recipient-option-modules')},
			{value: 'pot', text: this.props.l10n('Plant.recipient-option-pots')},
			{value: 'other', text: this.props.l10n('Plant.recipient-option-other')}
		];
		
		return (<View>
			<Fatty.Dropdown 
			data={ _.sortBy(places, 'text') } 
			label={this.props.l10n('Plant.placeField-label', eventDataObj)}
			hint={this.props.l10n('Plant.placeField-hint', eventDataObj)}
			value={eventData.place_id}
			onChange={item=>this.updateField('place_id', item.value)} />

			<Fatty.Pills
			data={plantFromOptions}
			label={this.props.l10n('Plant.from-label', eventDataObj)}
			hint={this.props.l10n('Plant.from-hint', eventDataObj)}
			value={eventData.from} 
			onChange={value=>this.updateField('from', value[0])} />

			<Fatty.Pills
			data={recipientOptions}
			label={this.props.l10n('Plant.recipient-label', eventDataObj)}
			hint={this.props.l10n('Plant.recipient-hint', eventDataObj)}
			value={eventData.recipient} 
			onChange={value=>this.updateField('recipient', value[0])} />


		</View>);
	}

}