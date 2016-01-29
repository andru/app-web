import React, {Component, PropTypes} from 'react'
import Listy from 'components/Listy';

import PlantingListItem from './PlantingListItem.jsx';

export default class PlantingList extends Component{
  static propTypes = {
    currentPlantings: PropTypes.object.isRequired,
    selectedPlantingId: PropTypes.string,
    onSelectionChange: PropTypes.func,
    activePanelIndex: PropTypes.number,
    onPanelChange: PropTypes.func
  };

  static defaultProps = {
    selectedPlantingIds: [],
    activePanelIndex: 0
  };

  handleItemPlaceClick = (item) => {
    // this.$set('activeListPanel', 5);
    // this.$set('listFilters', Immutable.fromJS([{filterName: 'place_id', valueName:item.get('place_id')}]));
  };

  handlePanelChange = () => {

  };

  handleSelectionChange = (selectedItems) => {
    this.props.onPlantingChange(selectedItems[0] && selectedItems[0].id || undefined)
  };

  render () {
    const {
      currentPlantings,
      selectedPlantingId,
      onSelectionChange,
      activePanelIndex,
      onPanelChange,
      filterOptions,
      filterFunction
    } = this.props

    let data = _.values(currentPlantings)

    return (
        <Listy 
        theme="green"
        data={data}
        selectedItems={data.filter(p => p.id === selectedPlantingId)}
        onChange={this.handleSelectionChange} 
        maintainItemSelection={true} 

        activePanel={activePanelIndex}
        onPanelChange={this.handlePanelChange}

        itemRenderer={ (i, props)=><PlantingListItem {...props} onPlaceClick={this.handleItemPlaceClick} />}
        searchFunction={(itm, string)=>itm.name.match(string)}
        filterOptions={filterOptions}
        filterFunction={filterFunction}

        /*filterValues={}*/
        onFilterChange={filters=>{
          console.log('Filters change', filters.toJS()); 
          this.$set('listFilters', filters)
        }}
        
        filters={[
          {
            label: 'Current'
          , filter: item=>true
          }
        ]} 
        onItemClick={this.handleItemClick} />
      )

  }
}
