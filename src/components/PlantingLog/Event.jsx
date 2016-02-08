import React, {Component, PropTypes} from 'react'
import {StyleSheet} from 'react-native-web'
import moment from 'moment'

import {View, Cover, Row} from 'components/View'

import {eventComponents, lifecycleEventNames, actionEventNames} from './EventTypes'

const defaultStyles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    flexShrink: 0
  },
  containerSelected: {
    backgroundColor: 'rgba(255,255,255,.3)'
  },
  containerHover: {
    backgroundColor: 'rgba(255,255,255,.2)'
  },
  date: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexBasis: 80
  },
  dateDay: {
    fontSize: 32,
    fontWeight: 700,
    lineHeight: '32px',
    flexBasis: 32,
    order: 2
  },
  dateMonth: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: '18px',
    flexBasis: 18,
    order: 1
  },
  details: {
    userSelect: 'initial',
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
    return this.props.onEditIntent(ev)
  };

  handleDateClick = (ev) => {

  };

  render () {
    const {eventData} = this.props
    const EventRenderer = eventComponents[ eventData.activityType || eventData.lifecycleStage ]
      || eventComponents.Generic

    return (
      <Row
        onClick={this.handleClick}
        style={defaultStyles.container} >
        <View
          style={defaultStyles.date}
          onClick={() => this.handleDateClick(eventData.date)}>
          <span style={defaultStyles.dateDay}>
            {moment(eventData.date).format('DD')}
          </span>
          <span style={defaultStyles.dateMonth}>
            {moment(eventData.date).format('MMM')}
          </span>
        </View>
        <View className="Planting-Timeline-Event-marker">
          <svg width="30">
            <circle cx="10" cy="50%" r="6" />
          </svg>
        </View>

        <View style={defaultStyles.details} key="view">
          <EventRenderer
            eventData={eventData}
            l10n={(code) => code} />
          <View className="Planting-Timeline-Event-actions">
            {/*this.props.showActions &&
              (<View>
              <IconButton icon="edit" size="tiny" onClick={this.props.onEdit} />
              <IconButton icon="trash" size="tiny" onClick={this.props.onTrash} />
              </View>)
              */}
            </View>
          </View>
        </Row>
    )
  }
}
