import React, {Component, PropTypes} from 'react'
import View, { Cover, Row, Col } from 'components/View'
import { StyleSheet } from 'react-native-web'
import _ from 'lodash'

import LogEvent from './Event'
import AddButton from './AddButton'
import {eventComponents, lifecycleEventNames, actionEventNames} from './EventTypes'
import {
  orderEventsByDate,
  getEarliestTimelineDate,
  getLatestTimelineDate
} from 'utils/plantings'
import {formatPlantingForLog} from 'utils/plantings'

const defaultStyles = StyleSheet.create({
  container: {
    overflowY: 'scroll',
    backgroundColor: '#f8d454',
    flexDirection: 'column'
  },
  yearBoundary: {

  },
  yearBoundaryLabel: {

  },
  month: {
    paddingTop: 10,
    paddingBottom: 10
  },
  solidTimelineSegment: {
    borderColor: '#818076'
  },
  event: {

  }
})

export default class Log extends Component {

  static propTypes = {
    l10n: PropTypes.func.isRequired,
    planting: PropTypes.object.isRequired,
    dateRange: PropTypes.object.isRequired,
    monthEvents: PropTypes.object.isRequired,
    onEventClick: PropTypes.func,
    onEventEditIntent: PropTypes.func,
    eventTypes: PropTypes.object,
    selectedEventIndex: PropTypes.number
  };

  static defaultProps = {
    styles: defaultStyles
  };

  handleWindowKeyDown = (ev) => {
    ev.stopPropagation()
    console.dir(ev)
  };

  handleAddClick = (ev) => {

  };

  handleEdit = (eventIndex) => {
    this.props.onEventEditIntent(eventIndex)
  };

  render () {
    const {planting, dateRange, monthEvents, styles} = this.props

    return (
      <Cover style={styles.container}>

        {this.renderItems()}

        {monthEvents &&
          <AddButton
            label={this.props.l10n('AddEventButton')}
          icon="add"
          keys={['cmd', '+']}
          onClick={this.handleAddClick}  />
        }
      </Cover>
    )
  }

    /**
   * Render list of events, grouped by month.
   * @return {array} Array of ReactElements
   */
  renderItems () {
    const {dateRange, monthEvents, styles} = this.props

    let renderedMonths = []
    let previousMonthWasEmpty = true
    let monthNo = 0

    dateRange.by('months', moment => {
      const thisMonthEvents = monthEvents[moment.format('YYYY MM')]
      const isEmpty = !thisMonthEvents

      if(previousMonthWasEmpty && isEmpty){
        return;
      }
      previousMonthWasEmpty=isEmpty;
      //output a year boundary if needed
      if(moment.get('month')===0){
        <Row style={styles.yearBoundary}>
          <View style={styles.yearBoundaryLabel}>{moment.format('YYYY')}</View>
        </Row>
      }
      if(isEmpty){
          renderedMonths.push(
          <Row style={styles.month} key={moment.format('YYYY-MM')}>
            <View style={styles.solidTimelineSegment}>
              <svg width="30">
                <line x1="10" y1="0" x2="10" y2="100%" />
              </svg>
            </View>
          </Row>);
      }else{
        renderedMonths.push(
          <Row style={styles.month}/*key={moment.format('YYYY-MM')}*/>
            <View style={styles.solidTimelineSegment}>
              <svg width="30">
                <line x1="10" y1="0" x2="10" y2="100%"  />
              </svg>
            </View>
            {/*<TransitionGroup
            component="View"
            transitionName="Plantings-animateTimeline"
            ref="timelineContent">*/}
              {this.renderMonthEvents( thisMonthEvents, monthNo )}
            {/*</TransitionGroup>*/}
          </Row>
        );
      }

      monthNo++;
    });

    renderedMonths.reverse();

    //add a final month on the end to pad the timeline out to
    //full height
    renderedMonths.push(<Row key="fillerMonth">
      <View style={{...styles.solidTimelineSegment}}>
        <svg width="30" style={{flex:1}}>
          <line x1="10" y1="0" x2="10" y2="100%" />
        </svg>
      </View>
    </Row>);

    return renderedMonths;
  }

  renderMonthEvents (monthEvents, monthNo) {
    const {selectedEventIndex, planting} = this.props

    return (
      <Col>
        {monthEvents
          .map( (eventData, i)=>{
            //note: events have been grouped by month... i!=eventData index in month group, not original timeline
            return (
              <LogEvent
                eventData={eventData}
                isSelected={selectedEventIndex===eventData.indexInTimeline}
                //showActions={true || this.$get('showActions')}
                onEditIntent={()=>this.handleEdit(eventData.indexInTimeline)}
                //onTrash={()=>this.getActions('planting').trashEvent.push([eventData.indexInTimeline])}
                key={eventData.indexInTimeline} />
                )
          })
        .reverse()}
      </Col>
    )
  }


}
