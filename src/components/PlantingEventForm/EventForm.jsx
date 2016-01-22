import React, {Component, PropTypes} from 'react'
import View, { Cover } from 'components/View'
import { StyleSheet } from 'react-native-web'
import _ from 'lodash'

import {SolidButton, ButtonPanel} from 'Buttons'

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
    showEventNameField: true
  };

  handleWindowKeyDown: (ev)=>{
    ev.stopPropagation()
    console.dir(ev)
  }

  // addCustom = (name) => {
  //   console.log('Adding custom event', name);
  //   var token = name.toLocaleLowerCase().replace(/\s+/,'_');
  //   this.getActions('user').addCustomEventType.push([{
  //     type: this.eventData.get('eventType')
  //   , name: token
  //   , localized: name
  //   }]);
  //   this.handleFieldChange('eventName', token);
  // };


  //event type change, if the eventType changes then
  //start over from a clean event object
  //and migrate over the date and notes
  handleEventNameChange = ( item ) => {
    var ev = this.props.eventData;
    this.props.onChange(
      this.eventData
      .clear()
      .set('date', ev.get('date'))
      .set('notes', ev.get('notes'))
      .set('eventType', item ? item.type : undefined)
      .set('eventName', item ? item.name : undefined)
    )
  };

  handleModelChange = (eventData) => {
    this.props.onChange(eventData)
  };

  handleNotesChange = (notes) => {
    this.handleFieldChange('notes', notes);
    if (notes 
    && !this.eventData.get('eventType') 
    || !this.eventData.get('eventName')) {
      this.props.onChange(this.eventData
        .set('eventType', 'activity')
        .set('eventName', 'observe')
      )
    }
  };

  handleFieldChange = (property, value) => {
    this.props.onChange( this.eventData.set(property, value) )
  };


  render () {
    let {eventData} = this.props

    return (
      <Cover styles={{...styles, ...this.props.styles.formContainer}}>
        <Fatty.Sheet>

          <Fatty.DatePicker 
          label={this.l10n('Planting-EventForm-date-label')} 
          date={eventData.get('date')} 
          onChange={this._fieldChange.bind(this, 'date')}
          collapse={false}
          ref="DatePicker" />

          {this.props.showNameField || this.renderEventNameDropdown() }

          {  eventData.get('eventType') 
          && eventData.get('eventName')
          && this.renderEventFields() }

          {this.renderNotes()}

        </Fatty.Sheet>
      </Cover>
    )
  }

  renderEventNameDropdown(){
    const {eventData, eventTypes} = this.props;

    let eventOptions = _.map(
      defaultEvents.get('activity').toJS(),
      name=>({
        name: name,
        type: 'activity',
        text:name
      })
    )
    .concat( _.map(
      defaultEvents.get('lifecycle').toJS(),
      name=>({
        name: name,
        type: 'lifecycle',
        text: name
      })
    ))

    return (
      <Fatty.Dropdown 
      label={this.l10n('Planting-EventForm-eventName-label', event.toJS())}
      hint={this.l10n('Planting-EventForm-eventName-hint', event.toJS())}
      data={ _.sortBy(eventOptions, 'text') }
      itemComponent={EventNameItem}
      tagComponent={EventNameItem}
      value={_.find(eventOptions, {name: event.get('eventName')})}
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
  
  renderEventFields(){
    const eventName = this.props.eventData.get('eventName')
    const EventRenderer = eventComponents[ eventName ] || eventComponents.Generic
    

    return (<EventRenderer 
      eventData={this.props.eventData} 
      onChange={this.handleModelChange}
      isEditing={true} 
      key={eventName} />);
  }
  
, renderNotes(){
    const event = this.props.eventData
    return (
      <View>
        <Fatty.Text 
        value={event.get('notes')} 
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
