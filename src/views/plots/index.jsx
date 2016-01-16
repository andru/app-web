import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import Measure from 'react-measure';

import {Cover} from 'components/View'
import Plotter from 'components/Plotter'

import { actions as plotActions } from '../../redux/modules/plots'

const mapStateToProps = (state) => ({
  plantings: state.plantings,
  plants: state.plants,
  places: state.places
})

// array reducer. given an unsorted array of dates, reduce to the earliest
function earliest (earliest, value, i) {
  return value < earliest ? value : earliest
}
// array reducer. given an unsorted array of dates, reduce to the latest
function latest (latest, value, i) {
  return value > latest ? value : latest
}
//return the last elemet of an array
function last (arr) {
  return arr[arr.length-1]
}

function getDate (event) {
  return event.eventType === 'period'
    ? (event.actualDateRange || event.estimateDateRange).map(string => new Date(string))
    : new Date(event.actualDate || event.estimateDate)
}

function getEarliestDate (event) {
  return event.eventType === 'period'
    ? getDate(event)[0]
    : getDate(event)
}

function getLatestDate (event) {
  return event.eventType === 'period'
    ? getDate(event)[1]
    : getDate(event)
}

function getLatestTimelineDate (timeline) {
  return timeline.map(event => getLatestDate(event)).reduce(latest)
}

// check whether an event is an estimate or actual
function isEstimate (event) {
  return (event.actualDate || event.actualDateRange)
}

function addLine (lines=[], line) {
  // extend the previous line if the new line is of the same type
  lines.length
    ? last(lines).appearance === line.appearance
      ? lines[lines.length-1] = {...last(lines), to: line.to}
      : lines.push(line)
    : lines.push(line)

  return lines
}

export class PlotsView extends React.Component {
  static propTypes = {
    // counter: React.PropTypes.number.isRequired,
    // doubleAsync: React.PropTypes.func.isRequired,
    // increment: React.PropTypes.func.isRequired
  };

  state = {
    dimensions: {},
    isMounted: false
  };

  componentDidMount = () => {
    setTimeout(() => this.setState({isMounted: true}), 20)
  };

  render () {
    const {plantings, plants, places} = this.props
    const {width, height} = this.state.dimensions

    let testData = [
      {
        _id: 'rhubarb',
        name: 'Rhubarb',
        progress: .4,
        x: 100,
        y: 200,
        width: 200,
        height: 50,
        rotation: 0,
        zIndex: 1
      },
      { 
        _id: 'kale',
        name: 'Kale',
        progress: .7,
        x: 300,
        y: 200,
        width: 140,
        height: 60,
        rotation: 20,
        zIndex: 2
      }
    ]

    return (
        <Measure
        onMeasure={(dimensions, mutations, target) => {
          console.log('Dimensions: ', dimensions);
          this.setState({dimensions})
        }}>
          <Cover style={{visibility: this.state.isMounted ? 'visible' : 'hidden'}}>
            <Plotter {...{width, height, plantings:testData}} />
          </Cover>

        </Measure>
    )
  }
}

export default connect(mapStateToProps, plotActions)(PlotsView)

const styles = StyleSheet.create({
})
