import React, {Component, PropTypes} from 'react'
import View, { Cover } from 'components/View'
import { StyleSheet } from 'react-native-web'
import _ from 'lodash'

import {PlantingLogEvent as LogEvent} from './Event'
import {eventComponents, lifecycleEventNames, actionEventNames} from './eventTypes'
import {
  orderEventsByDate,
  getEarliestTimelineDate,
  getLatestTimelineDate
} from 'utils/plantings'
import {formatPlantingForLog} from 'utils/plantings'

const styles = StyleSheet.create({
  container: {
    overflowY: scroll
  }
})

export default class EventForm extends Component {

  static propTypes = { 
    l10n: PropTypes.func.isRequired,
    plantingData: PropTypes.object.isRequired,
    timelineData: PropTypes.object.isRequired, 
    onEventClick: PropTypes.func,
    onEditIntent: PropTypes.func,
    eventTypes: PropTypes.object,
    selectedEventIndex: PropTypes.number
  };

  static defaultProps = {
  };

  handleWindowKeyDown = (ev) => {
    ev.stopPropagation()
    console.dir(ev)
  };

  handleAddClick = (ev) => {

  };

  handleEdit = (ev) => {

  };

  render () {
    const {planting, dateRange, monthEvents} = this.props

    return (
      <Cover styles={{...styles, ...this.props.styles.container}}>

        {this.renderItems()}

        {timeline && !!timeline.length &&
          <TimelineButton 
          label={this.props.l10n('Planting-View-Timeline-button-addEvent')} 
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
    const {dateRange, monthEvents} = this.props
    
    let renderedMonths = []
    let previousMonthWasEmpty = true
    let monthNo = 0

    dateRange.by('months', moment => {
      const thisMonthEvents = monthEvents[moment.format('YYYY MM')]
      const isEmpty = !thisMonthEvents
      const monthClasses = cx(
        'Planting-View-Timeline-month'
        , {
            'Planting-View-Timeline-month--empty': isEmpty
        })

      if(previousMonthWasEmpty && isEmpty){
        return;
      }
      previousMonthWasEmpty=isEmpty;
      //output a year boundary if needed
      if(moment.get('month')===0){
        <div className="Planting-View-Timeline-yearBoundary">
          <span className="Planting-View-Timeline-yearBoundary-year">{moment.format('YYYY')}</span>
        </div>
      }
      if(isEmpty){ 
          renderedMonths.push(
          <div className={monthClasses} key={moment.format('YYYY-MM')}>
            <div className="Planting-View-Timeline-month-line">
              <svg width="30">
                <line x1="10" y1="0" x2="10" y2="100%" />
              </svg>
            </div>
          </div>);
      }else{
        renderedMonths.push(
          <div className={monthClasses} /*key={moment.format('YYYY-MM')}*/>
            <div className="Planting-View-Timeline-month-line">
              <svg width="30">
              <line x1="10" y1="0" x2="10" y2="100%"  />
              </svg>
            </div>
            {/*<TransitionGroup 
            component="div" 
            transitionName="Plantings-animateTimeline"
            ref="timelineContent">*/}
              {this.renderMonthEvents( thisMonthEvents, monthNo )}
            {/*</TransitionGroup>*/}
          </div>
        );
      }
      
      monthNo++;
    });
    
    renderedMonths.reverse();

    //add a final month on the end to pad the timeline out to 
    //full height
    renderedMonths.push(<div className="Planting-View-Timeline-month" key="fillerMonth" style={{flex:'1 0 70px'}}>
      <div className="Planting-View-Timeline-month-line" style={{flex:1, opacity:.5}}>
        <svg width="30" style={{flex:1}}>
          <line x1="10" y1="0" x2="10" y2="100%" />
        </svg>
      </div>
    </div>);
    
    return renderedMonths;
  }
  
  renderMonthEvents (monthEvents, monthNo) {
    const {activeEventIndex, planting} = this.props

    return monthEvents
      .map( (eventData, i)=>{
        //note: events have been grouped by month... i!=eventData index in month group, not original timeline
        let timelineIndex = planting.timeline.indexOf(eventData);
        return (
          <LogEvent
          eventData={eventData}
          isSelected={activeEventIndex===timelineIndex}
          //showActions={true || this.$get('showActions')}
          onEditIntent={()=>this.handleEdit(timelineIndex)}
          //onTrash={()=>this.getActions('planting').trashEvent.push([timelineIndex])}
          key={timelineIndex} />
        )
      })
      .reverse().toArray();
  }


}
