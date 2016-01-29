import React, {Component, PropTypes} from 'react'
import {StyleSheet} from 'react-native-web'

import {View, Cover} from 'components/View'

import {eventComponents, lifecycleEventNames, actionEventNames} from './EventTypes'

const defaultStyles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flexShrink: 0,
    flexDirecton: 'row'
  },
  containerSelected: {
    backgroundColor: 'rgba(255,255,255,.3)'
  },
  containerHover: {
    backgroundColor: 'rgba(255,255,255,.2)'
  },
  date: {
    flexDirecton: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexBasis: 80
  },
  dateDay: {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: 32,
    flexBasis: 32, 
    order: 2
  },
  dateMonth: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 18,
    flexBasis: 18,
    order: 1
  },
  details: {
    userSelect: initial,
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    alignSelf: 'center'
  }
})

export default class PlantingLogEvent extends Component{
  static propTypes = {
    onEditIntent: PropTypes.func,
    isSelected: PropTypes.bool,
    styles: PropTypes.object
  };

  static defaultProps = {
    isSelected: false,
    styles: defaultStyles
  };

  handleClick = (ev) => {
    return this.onEditIntent(ev)
  };

  render () {
    const {eventData} = this.props
    const EventRenderer = eventComponents[ eventData.eventName ] || eventComponents.Generic

    return (
      <View onClick={this.handleClick} style={defaultStyles.container} >
        <View style={defaultStyles.date} onClick={this.handleDateClick.bind(this, eventData.date)}>
          <span style={defaultStyles.dateDay}>{moment(eventData.date).format('DD')}</span>
          <span style={defaultStyles.dateMonth}>{moment(eventData.date).format('MMM')}</span>
        </View>
        <View className="Planting-Timeline-Event-marker">
          <svg width="30">
          <circle cx="10" cy="50%" r="6" />
          </svg>
        </View>

        <View style={defaultStyles.details} key="view">
          <Renderer model={this.props.model} />
          <View className="Planting-Timeline-Event-actions">
            {/*this.props.showActions &&
              (<View>
                <IconButton icon="edit" size="tiny" onClick={this.props.onEdit} />
                <IconButton icon="trash" size="tiny" onClick={this.props.onTrash} />
              </View>)
            */}
          </View>
        </View>
      </View>
    )
  }
}