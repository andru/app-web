import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import Measure from 'react-measure'
import moment from 'moment'
import _ from 'lodash'
import translate from 'counterpart'

import {Cover} from 'components/View'
import PlantingList from 'components/PlantingList'
import PlantingLog from 'components/PlantingLog'
import {EditEvent} from 'components/PlantingEventForm'
import {actions as plantingsActions } from '../../redux/modules/plantings'
import {selector, actions as listActions } from '../../redux/modules/plantingsList'

const defaultStyles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  }
})

const l10n = {
  'PlantingLog.AddEventButton': 'Add New Event',
  'PlantingLog.Event.Plant.Material.Seed': 'Seed',
  'PlantingLog.Event.Plant.Material.Plantlet': 'Plantlet',
  'PlantingLog.Event.Plant.Material.Cutting': 'Cutting',
  'PlantingLog.Event.Plant.Material.Tuber': 'Tuber',
  'PlantingLog.Event.Plant.Recipient.Earth': 'Earth',
  'PlantingLog.Event.Plant.Recipient.Tray': 'Tray',
  'PlantingLog.Event.Plant.Recipient.Modules': 'Modules',
  'PlantingLog.Event.Plant.Recipient.Pots': 'Pots',
  'PlantingLog.Event.Plant.Recipient.Other': 'Other',

  'PlantingEventForm.DatePickerLabel': 'Date',
  'PlantingEventForm.EventNameLabel': 'Event Name',
  'PlantingEventForm.EventNameHint': '',
  'PlantingEventForm.NotesLabel': 'Notes',
  'PlantingEventForm.CancelButton': 'Cancel',
  'PlantingEventForm.SaveButton': 'Save',

  'PlantingEventForm.Event.Plant.Material.Seed': 'Seed',
  'PlantingEventForm.Event.Plant.Material.Plantlet': 'Plantlet',
  'PlantingEventForm.Event.Plant.Material.Cutting': 'Cutting',
  'PlantingEventForm.Event.Plant.Material.Tuber': 'Tuber',
  'PlantingEventForm.Event.Plant.Recipient.Earth': 'Earth',
  'PlantingEventForm.Event.Plant.Recipient.Tray': 'Tray',
  'PlantingEventForm.Event.Plant.Recipient.Modules': 'Modules',
  'PlantingEventForm.Event.Plant.Recipient.Pots': 'Pots',
  'PlantingEventForm.Event.Plant.Recipient.Other': 'Other',
  'PlantingEventForm.Event.Plant.PlaceLabel': 'Grow Space',
  'PlantingEventForm.Event.Plant.PlaceHint': '',
  'PlantingEventForm.Event.Plant.FromLabel': 'Planting Material',
  'PlantingEventForm.Event.Plant.FromHint': '',
  'PlantingEventForm.Event.Plant.RecipientLabel': 'Planting Medium',
  'PlantingEventForm.Event.Plant.RecipientHint': '',

  'PlantingEventForm.Event.Transplant.Recipient.Earth': 'Earth',
  'PlantingEventForm.Event.Transplant.Recipient.Tray': 'Tray',
  'PlantingEventForm.Event.Transplant.Recipient.Modules': 'Modules',
  'PlantingEventForm.Event.Transplant.Recipient.Pots': 'Pots',
  'PlantingEventForm.Event.Transplant.Recipient.Other': 'Other',
  'PlantingEventForm.Event.Transplant.PlaceLabel': 'Grow Space',
  'PlantingEventForm.Event.Transplant.PlaceHint': '',
  'PlantingEventForm.Event.Transplant.RecipientLabel': 'Planting Medium',
  'PlantingEventForm.Event.Transplant.RecipientHint': '',
}
translate.setSeparator('*')
translate.registerTranslations('en', l10n)

export class PlantingsView extends React.Component {
  static propTypes = {
    viewState: PropTypes.object,
    selectedPlanting: PropTypes.object,
    selectedEvent: PropTypes.object,
    logData: PropTypes.object,
    styles: PropTypes.object
  };
  static defaultProps = {
    styles: defaultStyles
  };

  state = {
    dimensions: {},
    isMounted: false
  };

  componentDidMount = () => {
    setTimeout(() => this.setState({isMounted: true}), 1)
  };

  // TODO move l10n into store
  l10n (key, data) {
    if (!l10n[key]) {
      return `No l10n for key ${key}`
    }
    return translate(key, data)
  }

  handleEventEditIntent = (eventIndex) => {
    this.props.showEditEventUI({eventIndex})
  };

  handleEventDataChange = (eventData) => {
    const {
      selectedPlantingId,
      selectedEventIndex
    } = this.props.viewState
    this.props.editEvent({
      plantingId: selectedPlantingId,
      eventIndex: selectedEventIndex,
      eventData
    })
  };

  handleEventUISave = () => {

  };

  handleEventUICancel = () => {
    this.props.hideEditEventUI()
  };

  render () {
    const {
      plantings,
      trashedPlantings,
      activePlantings,
      plants,
      places,
      viewState,
      selectedPlanting,
      selectedEvent,
      logData,
      styles
    } = this.props
    const {width, height} = this.state.dimensions

    console.log(selectedPlanting, selectedEvent, viewState)

    return (
      <Measure
        onMeasure={(dimensions, mutations, target) => {
        console.log('Dimensions: ', dimensions)
        this.setState({dimensions})
        }}>
        <Cover style={{...styles.container, visibility: this.state.isMounted ? 'visible' : 'hidden'}}>
          <PlantingList
            currentPlantings={activePlantings}
            filterFunction={() => true}
            selectedPlantingId={selectedPlanting ? selectedPlanting.id : undefined}
            onPlantingChange={(id) => this.props.setSelectedPlanting({id})}
            onPanelChange={() => true} />

          {selectedPlanting &&
            <PlantingLog
              l10n={(key, data) => this.l10n(`PlantingLog.${key}`, data)}
              planting={selectedPlanting}
              dateRange={logData.dateRange}
              monthEvents={logData.monthEvents}
              onEventEditIntent={this.handleEventEditIntent}
              selectedEventIndex={viewState.selectedEventIndex}/>
          }

          {selectedPlanting && selectedEvent && viewState.isEditingEvent &&
            <EditEvent
              l10n={(key, data) => this.l10n(`PlantingEventForm.${key}`, data)}
              onChange={this.handleEventDataChange}
              onCancel={this.handleEventUICancel}
              onSave={this.handleEventUISave}
              eventData={selectedEvent} />
          }
        </Cover>
      </Measure>
    )
  }
}

export default connect((state, props) => ({...selector(state, props), location: props.location}), {...plantingsActions, ...listActions})(PlantingsView)
