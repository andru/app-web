'use strict';

const React = require('react');
const Immutable = require('immutable');
const cx = require('classnames');
const _ = require('lodash');
const uncontrollable = require('uncontrollable');
import ReactList from 'react-list';


import Panelled, {Panel, Tab, TabSpacer} from 'Panelled/Panelled';
import Item from './Item';

import Filter from './Filter';

require('./Listy.css');


const Listy = React.createClass({
	
	propTypes: {
		data: React.PropTypes.oneOfType([
			React.PropTypes.instanceOf(Immutable.Iterable)
		,	React.PropTypes.array
		]).isRequired

	/**
	 * A list of predefined filters to show as tabs
	 */
	,	filters: React.PropTypes.instanceOf(Immutable.List)
	,	mutliple: React.PropTypes.bool

	,	activePanel: React.PropTypes.number
	,	onPanelChange: React.PropTypes.func
		
	,	selectedItems: React.PropTypes.instanceOf(Immutable.List)

	,	showAddButton: React.PropTypes.bool
	,	addComponent: React.PropTypes.element
	,	onAddClick: React.PropTypes.func

		//fires with full selected state
	,	onChange: React.PropTypes.func
		//fires with just the clicked item
	,	onItemClick: React.PropTypes.func
	,	itemRenderer: React.PropTypes.func.isRequired
	,	itemHeight: React.PropTypes.number
	,	itemHeightGetter: React.PropTypes.func

	
	,	searchValue: React.PropTypes.string
	,	onSearchChange: React.PropTypes.func
	,	searchFunction: React.PropTypes.func

	/**
	 * A list of maps describing possible filters
	 * `name` the name of the filter, usually referencing a property name
	 * `label` the localized label
	 * `values` a list of map objects with a `label` and `name` property
	 */
	, filterOptions: React.PropTypes.oneOfType([
			React.PropTypes.instanceOf(Immutable.List)
		,	React.PropTypes.array
		])
	,	filterValues: React.PropTypes.oneOfType([
			React.PropTypes.instanceOf(Immutable.List)
		,	React.PropTypes.object
		])
	,	filterFunction: React.PropTypes.func

	,	theme: React.PropTypes.string
	}

	
,	getDefaultProps(){
		return {
			onItemClick: ()=>{}
		,	multiple: false
		,	selectedItems: Immutable.List()

		,	itemRenderer: (i, props)=><Item {...props}>{props.item}</Item>
		,	itemHeight: 65

		,	activePanel: 0

		,	showAddButton: false

		,	showSearch: true
		,	searchValue: ''

		,	showFilters: true
		,	filterValues: Immutable.List()

		,	onAdd: ()=>{}
		,	onSearch: ()=>{}
		,	onSearchClick: ()=>{}
		,	theme: 'green'
		};
	}
	
,	componentWillReceiveProps(nextProps) {
		var direction;

	}

,	componentDidUpdate(oldProps){
		/*if(oldProps.showSearchSheet===false && this.props.showSearchSheet===true){
			this.refs.searchInput.focus();
		}*/
	}

,	_filterChange(i, filter){
		console.log('Filter change %s', i, filter.toJS());
		this.props.onFilterChange(this.props.filterValues.set(i, filter));
	}

,	_removeFilter(i){
		this.props.onFilterChange(this.props.filterValues.delete(i));
	}

,	_panelChange(i){
		this.props.onPanelChange(i);
		console.warn('Panel change', i, this.props.filters.count());
		if(this.props.searchFunction && i===this.props.filters.count()+1){
			console.warn("FOCUS SEARCH");
			this.refs.searchInput.focus();
		}
	}

,	_itemSelect(itemData){
		var selected = this.props.selectedItems.toJS ? this.props.selectedItems : Immutable.fromJS(this.props.selectedItems);
		
		this.props.onItemClick( itemData );

		if(this.props.multiple){
			//if it's already selected, deselect it
			if(selected.indexOf(itemData) > -1){
				selected = selected.delete( selected.indexOf(itemData) );
			}else{
				selected.push(itemData);
			}
		}else{
			selected = (selected.get(0) === itemData) ? selected.clear() : selected.clear().push(itemData);
		}

		this.props.onChange( this.props.selectedItems.toJS ? selected : selected.toJS() );
	}

	/**
	 * Defer to the render method supplied as `props.itemRenderer`, which 
	 * should return a component to render a list item.
	 * @param  {Immutable.Iterable} filteredData An Immutable iterable or POJO of filtered data items
	 * @param  {Number} i The index of the item in the filtered data
	 * @return {ReactElement}
	 */
,	itemRenderer(filteredData, i){
		var item = filteredData instanceof Immutable.Iterable ? filteredData.get(i) : filteredData[i];
		return this.props.itemRenderer(i, {
			onSelect: ev=>this._itemSelect(item)
		,	isSelected: this.props.selectedItems.indexOf(item) > -1
		,	item: item
		});
	}

	/**
	 * Return an item height in order to calculate full scroll height of list
	 * @param  {[type]} i [description]
	 * @return {[type]}   [description]
	 */
,	itemSizeGetter(i){
		return this.props.itemHeightGetter ? this.props.itemHeightGetter(i): this.props.itemHeight;
	}

,	filter(filter){
		return (this.props.data instanceof Immutable.Iterable)
			? this.props.data.filter(filter)
			: _.filter(this.props.data, filter)
		;
	}

,	getLength(data){
		//console.log('Getting length of data', data, data.count ? data.count() : data.length);
		return (data instanceof Immutable.Iterable)
			? data.count()
			: data.length
		;
	}
	
,	render(){	


		var searchData = this.props.searchFunction ? this.filter(item=>this.props.searchFunction(item, this.props.searchValue)) : null;
		var filterData = this.filter(item=>this.props.filterFunction(item, this.props.filterValues));

		return (
		<div className={cx('Listy', 'Listy--'+this.props.theme)}>

			<Panelled 
			theme={this.props.theme}
			activePanel={this.props.activePanel}
			onChange={this._panelChange}>
				{this.props.filters.map(filter=>{
					var data = this.filter(filter.filter);
					return (
						<Panel label={filter.label} key={filter.label}>
							{!!this.getLength(data)
								? <div className="Listy-List">
										<ReactList
										type="variable"
										itemRenderer={i=>this.itemRenderer(data, i)} 
										itemSizeGetter={this.itemSizeGetter}
										length={this.getLength(data)} />
									</div>
								: <div className="Listy-emptyMessage">Empty!</div>
							}
						</Panel>
					);
				})}

				<TabSpacer />

				{!this.props.searchFunction ||
				<Panel tabClassName="Listy-searchTab" icon={<i className="fa fa-search" />}>
					<div className="Listy-searchPanel">
						<input 
						className="Listy-searchInput"
						value={this.props.searchValue} 
						onChange={ev=>this.props.onSearchChange(ev.target.value)}
						ref="searchInput" />
					</div>
					<div className="Listy-List">
						{!!this.getLength(searchData)
							? <ReactList 
								type="variable"
								itemRenderer={i=>this.itemRenderer(searchData, i)} 
								itemSizeGetter={this.itemSizeGetter}
								length={this.getLength(searchData)} />
							: <div className="Listy-emptyMessage">Empty!</div>
						}
					</div>
				</Panel>
				}

				{!(this.props.filterOptions && this.props.filterFunction) ||
				<Panel tabClassName="Listy-filterTab" icon={<i className="fa fa-filter" />}>
					<div className="Listy-filterPanel">
							<div className="Listy-filterPanel-headers">
								<div className="Listy-filterPanel-propertyHeader">
									Show items where property...
								</div>
								<div className="Listy-filterPanel-valueHeader">
									equals value...
								</div>
							</div>

							{this.props.filterValues.map((filter, i)=>{
								return (<Filter 
								fields={this.props.filterOptions} 
								filter={filter} 
								onChange={newFilter=>this._filterChange(i, newFilter)} 
								onRemove={()=>this._removeFilter(i)}
								key={i} />)
							})}
							<Filter 
							fields={this.props.filterOptions} 
							filter={Immutable.Map()}
							onChange={newFilter=>this._filterChange(this.props.filterValues.count(), newFilter)} 
							key={this.props.filterValues.count()} />
						</div>
					<div className="Listy-List">
						{!!this.getLength(filterData)
							? <ReactList 
								type="variable"
								itemRenderer={i=>this.itemRenderer(filterData, i)}
								itemSizeGetter={this.itemSizeGetter}
								length={this.getLength(filterData)} />
							: <div className="Listy-emptyMessage">Empty!</div>
						}
					</div>
				</Panel>
				}
			</Panelled>

		</div>);
	}
	
,	sheetHasItems(sheet){
		return sheet.props.data 
			?	!!sheet.props.data.length
			: !!React.Children.count(sheet.props.children)
		;
	}

// ,	shouldComponentUpdate(nextProps, nextState){
// 		if(this.props.data !== nextProps.data)
// 			return true;
// 		if(this.props.filters !== nextProps.filters)
// 			return true;
// 		if(this.props.)
// 	}
	
});



export default uncontrollable(Listy, 
	{
		'searchValue': 'onSearchChange'
	,	'selectedItems': 'onChange'
	,	'filterValues': 'onFilterChange'
	,	'activePanel': 'onPanelChange'
	}
);

export { Item };

