import React, {Component, PropTypes} from 'react'
import View, { Cover } from 'components/View'
import { StyleSheet } from 'react-native-web'
import _ from 'lodash'

import Event from './Event'
import {eventComponents, lifecycleEventNames, actionEventNames} from './EventTypes'

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

  handleWindowKeyDown: (ev)=>{
    ev.stopPropagation()
    console.dir(ev)
  }

  render () {
    const {plantingData} = this.props
    const {timeline} = plantingData

    return (
      <Cover styles={{...styles, ...this.props.styles.container}}>

        {this.renderItems()}

        {timeline && !!timeline.length &&
          <TimelineButton 
          label={this.l10n('Planting-View-Timeline-button-addEvent')} 
          icon="add" 
          keys={['cmd', '+']}
          onClick={()=>this.getActions('planting').createEventUI.push([])}  />
        }
      </Cover>
    )
  }

    /**
   * Render list of events, grouped by month.
   * @return {array} Array of ReactElements
   */
  renderItems(){
    var events = this.$get(['selected', 'timeline'])
      .sort((a,b)=>a.get('date')>b.get('date') ? 1 : a.get('date') < b.get('date') ? -1 : 0 )
    ;
    console.log('Rendering events, ranging from %s to %s', events.first().get('date'), events.last().get('date'), events.toJS());

    var eventRange = moment.range(
      moment(events.first().get('date')).startOf('month'), 
      moment(events.last().get('date')).endOf('month')
    );
    
    let activeEvents = events.filter(ev=>ev.get('status')!==EVENT_STATUSES.TRASHED);
    var groupedEvents = activeEvents.groupBy(ev=>moment(ev.get('date')).format('YYYY MM'));
    
    var renderedMonths = [];
    var previousMonthWasEmpty = true;
    var monthNo = 0;
    eventRange.by('months', moment => {
      //console.log('rendering month', moment.format('LLLL'));
      let 
        monthEvents = groupedEvents.get( moment.format('YYYY MM') )
      , isEmpty = !monthEvents
      , monthClasses = cx(
        'Planting-View-Timeline-month'
        , {
            'Planting-View-Timeline-month--empty': isEmpty
        })
      ;
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
              {this.renderMonthEvents( monthEvents, monthNo )}
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
  
  renderMonthEvents( monthEvents, monthNo ){
    var 
      timeline = this.$get(['selected', 'timeline'])
    ;
    
    //console.log('Rendering month events', monthEvents.toJS(), timeline.toJS(), monthEvents.map(ev=>timeline.indexOf(ev)).toArray());

    return monthEvents
      .sort( (a, b)=>a.get('date') > b.get('date') ? 1 : a.get('date') < b.get('date') ? -1 : 0 )
      .map( (event, i)=>{
        //note: events have been grouped by month... i!=event index in month group, not original timeline
        let timelineIndex = timeline.indexOf(event);
        return (
          <TimelineEvent
          model={event}
          isActive={this.$get(['activeEventIndex'])===timelineIndex}
          //showActions={true || this.$get('showActions')}
          onEdit={()=>this.getActions('planting').editEventUI.push([timelineIndex])}
          //onTrash={()=>this.getActions('planting').trashEvent.push([timelineIndex])}
          key={this.$('planting').get('_id')
            .concat(moment(event.get('date')).format('YYYY-MM-DD'))
            .concat(i)
          } />
        )
      })
      .reverse().toArray();
  }


}
