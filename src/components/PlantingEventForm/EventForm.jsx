import React, {Component, PropTypes} from 'react'
import View, { Cover } from 'components/View'
import { StyleSheet } from 'react-native-web'
import _ from 'lodash'

import Fatty from 'components/Fatty'
import {SolidButton, ButtonPanel} from 'components/Buttons'

import EventNameDropdownItem from './EventNameDropdownItem'
import {eventComponents, lifecycleEventNames, actionEventNames} from './EventTypes'

const styles = StyleSheet.create({
  formContainer: {
    overflowY: scroll
  }
})

export default class EventForm extends Component {

  static propTypes = {
    eventData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired, 
    eventTypes: PropTypes.object,
    showEventNameField: PropTypes.bool 
  };

  static defaultProps = {
    showEventNameField: true,
    styles
  };

  l10n (code) {
    return code
  }

  handleWindowKeyDown = (ev) => {
    ev.stopPropagation()
    console.dir(ev)
  };

  // addCustom = (name) => {
  //   console.log('Adding custom event', name);
  //   var token = name.toLocaleLowerCase().replace(/\s+/,'_');
  //   this.getActions('user').addCustomEventType.push([{
  //     type: this.eventData.eventType
  //   , name: token
  //   , localized: name
  //   }]);
  //   this.handleFieldChange('eventName', token);
  // };


  //event type change, if the eventType changes then
  //start over from a clean event object
  //and migrate over the date and notes
  handleEventNameChange = ( item ) => {
    var eventData = this.props.eventData;
    this.props.onChange({
      date: eventData.date,
      notes: evendData.notes,
      eventType: item ? item.type : undefined,
      eventName: item ? item.name : undefined
    })
  };

  handleModelChange = (eventData) => {
    this.props.onChange(eventData)
  };

  handleNotesChange = (notes) => {
    this.handleFieldChange('notes', notes);
    if (notes 
    && !this.eventData.eventType 
    || !this.eventData.eventName) {
      this.props.onChange({
        eventType: 'activity',
        eventName: 'observe'
      })
    }
  };

  handleFieldChange = (property, value) => {
    this.props.onChange({ 
      ...this.props.eventData,
      ...{
        [property]: value
      }
    })
  };


  render () {
    let {eventData} = this.props

    return (
      <Cover styles={{...styles, ...this.props.styles.formContainer}}>
        <Fatty.Sheet>

          <Fatty.DatePicker 
          label={this.l10n('Planting-EventForm-date-label')} 
          date={eventData.date} 
          onChange={() => this.handleFieldChange('date')}
          collapse={false}
          ref="DatePicker" />

          {this.props.showNameField || this.renderEventNameDropdown() }

          {  eventData.eventType 
          && eventData.eventName
          && this.renderEventFields() }

          {this.renderNotes()}

        </Fatty.Sheet>
      </Cover>
    )
  }

  renderEventNameDropdown () {
    const {eventData, eventTypes} = this.props;

    const defaultEvents = {
      activity: [
        'prepare'
      , 'plant'
      , 'transplant'
      , 'harvest'
      , 'plant_out'
      , 'pot_on'
      , 'fertilize'
      , 'mulch'
      , 'water'
      , 'observe'
      , 'prune'
    ]

    , lifecycle:[
        'germinate'
      , 'leaf'
      , 'flower'
      , 'fruit'
      , 'death'
      , 'die_back'
      ]
    }

    let eventOptions = _.map(
      defaultEvents.activity,
      name=>({
        name: name,
        type: 'activity',
        text:name
      })
    )
    .concat( _.map(
      defaultEvents.lifecycle,
      name=>({
        name: name,
        type: 'lifecycle',
        text: name
      })
    ))

    return (
      <Fatty.Dropdown 
      label={this.l10n('Planting-EventForm-eventName-label', eventData)}
      hint={this.l10n('Planting-EventForm-eventName-hint', eventData)}
      data={ _.sortBy(eventOptions, 'text') }
      itemComponent={EventNameDropdownItem}
      tagComponent={EventNameDropdownItem}
      value={_.find(eventOptions, {name: eventData.eventName})}
      filter={(item, search)=>{
        let terms = search.toLocaleLowerCase().split(' ');
        return  _.all(terms, term=>(
          item.text.toLocaleLowerCase().match(term)
          ||item.type.toLocaleLowerCase().match(term)
        ));
      }} 
      onChange={item=>this.handleEventNameChange(item)} 
      /*onCreate={this.addCustom}
      */ />
    );
  }
  
  renderEventFields () {
    const eventName = this.props.eventData.eventName
    const EventRenderer = eventComponents[ eventName ] || eventComponents.Generic
    

    return (<EventRenderer 
      eventData={this.props.eventData} 
      onChange={this.handleModelChange}
      key={eventName} />);
  }
  
 renderNotes () {
    const event = this.props.eventData
    return (
      <View>
        <Fatty.Text 
        value={event.notes} 
        multiline={true} 
        autogrow={true}
        initialHeight={150}
        maxHeight={400}
        id="addEvent-notes" 
        label={this.l10n('Planting-EventForm-notes-label')}
        onChange={ev=>this.handleNotesChange(ev.target.value)} />
    </View>
    )
  }

}
