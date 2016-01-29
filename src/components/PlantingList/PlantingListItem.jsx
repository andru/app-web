import React, {Component, PropTypes} from 'react'
import {StyleSheet} from 'react-native-web'

import {View} from 'components/View'

const styles = StyleSheet.create({
  container: {
    height: 65
  }
})

export default class PlantingListItem extends Component{
  static propTypes = {
    item: PropTypes.object.isRequired,
    isSelected: PropTypes.bool,
    onSelect: React.PropTypes.func,
    onPlaceClick: React.PropTypes.func
  };
  static defaultProps = {
    isSelected: false
  };
  render () {
    const {item, onSelect, onPlaceClick} = this.props
    return (
      <div onClick={onSelect} style={styles.container}>
        <div className="Planting-List-Item-name">{item.name}</div>
        <div className="Planting-List-Item-details">
          <span className="Planting-List-Item-plantName">
            {item.plantName}
          </span>
          {item.place_id &&
          <span className="Planting-List-Item-placeName" onClick={onPlaceClick}>
            {item.placeName}
          </span>
          }
        </div>
      </div>
    );
  }
}