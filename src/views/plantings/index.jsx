import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'
import Measure from 'react-measure'
import moment from 'moment'
import _ from 'lodash'

import {Cover} from 'components/View'
import PlantingList from 'components/PlantingList'
import PlantingLog from 'components/PlantingLog'
import {actions as plantingsActions } from '../../redux/modules/plantings'
import {selector, actions as listActions } from '../../redux/modules/plantingsList'

const styles = StyleSheet.create({

})

export class PlantingsView extends React.Component {
  static propTypes = {
    // counter: React.PropTypes.number.isRequired,
    // doubleAsync: React.PropTypes.func.isRequired,
    // increment: React.PropTypes.func.isRequired
    timelineData: React.PropTypes.array
  };

  state = {
    dimensions: {},
    isMounted: false
  };

  componentDidMount = () => {
    setTimeout(() => this.setState({isMounted: true}), 1)
  };

  render () {
    const {
      plantings,
      trashedPlantings,
      activePlantings,
      plants,
      places,
      selectedPlanting,
      logData
    } = this.props
    const {width, height} = this.state.dimensions

    console.log(selectedPlanting)

    return (
      <Measure
        onMeasure={(dimensions, mutations, target) => {
          console.log('Dimensions: ', dimensions)
          this.setState({dimensions})
        }}>
        <Cover style={{visibility: this.state.isMounted ? 'visible' : 'hidden'}}>
          <PlantingList 
          currentPlantings={activePlantings}
          filterFunction={() => true}
          selectedPlantingId={selectedPlanting ? selectedPlanting.id : undefined}
          onPlantingChange={(id) => this.props.setSelectedPlanting({id})}
          onPanelChange={() => true} />

          {selectedPlanting &&
          <PlantingLog 
          l10n={(msg) => msg}
          planting={selectedPlanting}
          dateRange={logData.dateRange}
          monthEvents={logData.monthEvents}
          />}
        </Cover>
      </Measure>
    )
  }
}

export default connect((state, props) => ({...selector(state, props), location: props.location}), {...plantingsActions, ...listActions})(PlantingsView)

