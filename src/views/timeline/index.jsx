import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { Link } from 'react-router'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import Measure from 'react-measure'
import moment from 'moment'
import _ from 'lodash'

import {Cover} from 'components/View'
import Timeline, {TimeAxis, TrackGroup, Track, Line, Period, Marker} from 'components/Timeline'

import { actions as timelineActions, selector as timelineSelector } from '../../redux/modules/timeline'
import { actions as plantingsActions } from '../../redux/modules/plantings'

export class TimelineView extends React.Component {
  static propTypes = {
    // counter: React.PropTypes.number.isRequired,
    // doubleAsync: React.PropTypes.func.isRequired,
    // increment: React.PropTypes.func.isRequired
    timelineData: React.PropTypes.object
  }

  state = {
    dimensions: {},
    isMounted: false
  }

  componentWillMount = () => {

    const {plantings, plants, places} = this.props

  }

  componentDidMount = () => {
    setTimeout(() => this.setState({isMounted: true}), 20)
  }

  handleMarkerChange = (groupIndex, trackIndex, markerIndex, marker) => {
    // let data = this.state.data.slice()
    // data[groupIndex].tracks[trackIndex].markers[markerIndex] = marker
    // console.log('new data', data)
    // this.setState({
    //   data
    // })

    this.props.setPlantingEventDate({
      plantingId: this.props.timelineData[groupIndex].tracks[trackIndex].plantingId,
      eventIndex: marker.eventIndex,
      date: marker.date,
      dateType: 'actual'
    })

    // actions.go SET_PLANTING_EVENT_DATE
  }

  render () {
    const {plantings, plants, places} = this.props
    const {width, height} = this.state.dimensions

    // ouch, this needs to be optimized with https://github.com/faassen/reselect
    let data = this.props.timelineData

    // const plantingsForTimeline = plantings.filter()
    let start_date = new Date('2015-01-01')
    let end_date = new Date('2016-01-01')
 
    //console.log(data)

    return (
      <Measure
        onMeasure={(dimensions, mutations, target) => {
          console.log('Dimensions: ', dimensions);
          this.setState({dimensions})
        }}>
        <Cover style={{visibility: this.state.isMounted ? 'visible' : 'hidden'}}>
          <Timeline 
          from={start_date} 
          to={end_date} 
          height={height}
          width={width}
          data={data}
          onMarkerChange={this.handleMarkerChange} />
        </Cover>
      </Measure>
    )
  }
}

export default connect(timelineSelector, {...timelineActions, ...plantingsActions})(TimelineView)

const styles = StyleSheet.create({
})
