import React, {Component, PropTypes} from 'react'
import View, { Cover } from 'components/View'
import { StyleSheet } from 'react-native-web'

import {SolidButton as Button, Panel as ButtonPanel} from 'components/Buttons'

import EventForm from './EventForm'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F1DF',
    position: 'absolute',
    height: '100vh',
    width: '30vw',
    left: 0,
    top: 0
  }
})

export default class EditEvent extends Component {

  static propTypes = {
    eventData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onTrash: PropTypes.func.isRequired
  };

  static defaultProps = {
    styles
  }; 

  l10n (code) {
    return code
  }

  _change = (eventData) => {
    return this.props.onChange(eventData)
  };

  _save = () => {
    return this.props.onSave()  
  };
  
  _cancel = () => {
    return this.props.onCancel()
  };

  _trash = () => {
    return this.props.onTrash()
  };

  render () {
    let {wot} = this.props

    return (
      <Cover style={{...styles, ...this.props.styles.container}}>
        <EventForm
        eventData={this.props.eventData}
        onChange={this._change} 
        busy={this.props.isSaving}
        initialFocus={this.props.isFocused}
        key="EditEventPanel" />

        <ButtonPanel className="Planting-EventForm-buttonPanel">
          <Button 
          onClick={this._cancel}
          label={this.l10n('Planting-EventForm-button-cancel')} />

          <Button 
          onClick={this._trash}
          iconClass="fa fa-trash" />
          
          <Button 
          onClick={this._save}
          label={this.l10n('Planting-EventForm-button-save')} 
          iconClass="fa fa-check" 
          color="green"
          kind="raised"
          align="right" />
        </ButtonPanel>
      </Cover>
    )
  }

}
