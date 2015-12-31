import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'

import {Cover} from 'components/View'
import Timeline, {Track, Line, Period, Marker} from 'components/Timeline'

import { actions as timelineActions } from '../../redux/modules/timeline'

const mapStateToProps = (state) => ({
  plantings: state.plantings,
  ...state.timeline
})
export class TimelineView extends React.Component {
  static propTypes = {
    // counter: React.PropTypes.number.isRequired,
    // doubleAsync: React.PropTypes.func.isRequired,
    // increment: React.PropTypes.func.isRequired
  }

  render () {
    const {plantings} = this.props
    // const plantingsForTimeline = plantings.filter()
    let start_date = new Date('2015-01-01')
    let end_date = new Date('2016-01-01')

    let groups = [

      { 
        name: 'Kitchen Garden',
        tracks:[{
          from: new Date('2015-02-08'),
          to: new Date('2015-07-28'),
          markers: [
            {
              date: new Date('2015-05-01')
            }
          ],
          periods: [
            {
              from: new Date('2015-04-10'),
              to: new Date('2015-06-10')
            }
          ]
        },{
          from: new Date('2015-01-08'),
          to: new Date('2015-10-28'),
          markers: [
            {
              date: new Date('2015-01-28')
            },
            {
              date: new Date('2015-01-29')
            },
            {
              date: new Date('2015-02-11')
            }
          ],
          periods: [
            {
              from: new Date('2015-04-10'),
              to: new Date('2015-06-10')
            }
          ]
        }]
      },
      {
        name: 'Main Garden',
        tracks: [{
          from: new Date('2015-04-08'),
          to: new Date('2015-12-30'),
          markers: [
            {
              date: new Date('2015-05-01')
            }
          ],
          periods: [
            {
              from: new Date('2015-05-10'),
              to: new Date('2015-06-10')
            }
          ]
        },{
          from: new Date('2015-02-08'),
          to: new Date('2015-05-28'),
          markers: [
            {
              date: new Date('2015-03-28')
            },
            {
              date: new Date('2015-04-29')
            },
            {
              date: new Date('2015-05-11')
            }
          ],
          periods: [
            {
              from: new Date('2015-03-10'),
              to: new Date('2015-04-10')
            }
          ]
        }]
      }
    ]

    return (
      <Cover>
      {groups.map( ({name, tracks}) => ( 
        <Timeline from={start_date} to={end_date}>
          {tracks.map(({from, to, periods, markers}, i)=>
            (<Track from={from} to={to} key={i}>
              {periods.map( ({from, to}, i) => <Period from={from} to={to} key={i} /> )}

              <Line from={from} to={to} />

              {markers.map( ({date}, i) => <Marker date={date} icon={true} key={i} /> )}
            </Track>)
          )}
        </Timeline>
        ))}
      </Cover>
    )
  }
}

export default connect(mapStateToProps, timelineActions)(TimelineView)

const styles = StyleSheet.create({
})