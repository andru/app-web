import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { StyleSheet } from 'react-native-web'
import TransitionGroup from 'react-addons-css-transition-group'

import View from 'components/View'

let NavBar = React.createClass({

	
	// propTypes: {
 //    counter: React.PropTypes.number.isRequired,
 //    doubleAsync: React.PropTypes.func.isRequired,
 //    increment: React.PropTypes.func.isRequired
 //  },
 //  
 //  

	
	render(){
		var sections = ['timeline', 'plots', 'journal', 'plantings', 'seedbox', 'growspaces', 'plants'];
		var icons = ['journal.svg', 'journal.svg', 'journal.svg', 'plantings.svg', 'seedbox.svg', 'growspaces.svg', 'plantings.svg']
		return (
		<View style={styles.NavBar}>
    	<View style={styles.TabContainer}>
    		{sections.map( (s, i)=>(
    			<Link to={`/${s}`} style={styles.Tab} key={s}>
    				<View style={{...styles.TabIcon, backgroundImage: 'url('+require(`file!static/icons/modules/${icons[i]}`)+')'}}></View>
    				<View className="NavBar-Tab-label">{/*this.l10n('NavBar-SectionTab-'+s)*/ s}</View>
    			</Link>
	    	))}
    	</View>  
    	<View className="App-NavBar-export">
    		<i className="fa fa-arrow-down" onClick={()=>this.handleNavClick('export')} />
    	</View>
    	<View className="App-NavBar-info">
    		<i className="fa fa-ellipsis-h" onClick={()=>this.handleNavClick('info')} />
    	</View>
    </View>)
	}
});

// const mapStateToProps = (state) => ({
  
// })

// export default connect(mapStateToProps, counterActions)(NavBar) 

export default NavBar

const styles = StyleSheet.create({
  NavBar: {
  	display: 'flex',
  	flexDirection: 'row',
   	backgroundColor: 'white',
   	justifyContent: 'space-between'
  }, 
  TabContainer: {
  	display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  Tab: {
  	display: 'flex',
    flexDirection: 'row',

    paddingTop: 15,
    paddingRight: 20,
    paddingBottom: 15,
    paddingLeft: 15,

    cursor: 'pointer',
    // transition: border .5s,

    borderTopWidth: 3,
    borderTopColor: 'transparent',

    alignItems: 'center'
  },
  TabHover: {
  	color: '#f06f68',
    outline: 'none',
    backgroundColor: 'transparent'
  },
  TabActive: {
  	color: '#f06f68',
    borderTopWidth: 3,
    borderColor: '#f06f68',
    outline: 'none',
    backgroundColor: 'transparent'
  },
  TabIcon: {
  	width: 32,
    height: 32,
    marginRight: 5
  }
})




/*

.App-NavBar
{
    display: flex;
    flex-direction: row;

    border-bottom: none;
    background: white;

    justify-content: space-between;
}
.App-NavBar .NavBar-ModuleTabs
{
    display: flex;
    flex-direction: row;

    justify-content: center;
    flex: 1;
}
.App-NavBar .NavBar-Tab
{
    display: flex;
    flex-direction: row;

    padding: 15px 20px 15px 15px;

    cursor: pointer;
    transition: border .5s;

    border-top: 3px solid transparent;

    align-items: center;
}
.App-NavBar .NavBar-Tab:hover,
.App-NavBar .NavBar-Tab:focus
{
    color: #f06f68;
    outline: none;
    background: transparent;
}
.App-NavBar .NavBar-Tab--active,
.App-NavBar .NavBar-Tab--active:hover,
.App-NavBar .NavBar-Tab--active:focus
{
    color: #f06f68;
    border-top: 3px solid #f06f68;
    outline: none;
    background: transparent;
}
.App-NavBar .NavBar-Tab-icon
{
    width: 32px;
    height: 32px;
    margin-right: 5px;
}
.App-NavBar .NavBar-Tab-icon-plantings
{
    background-image: url(../icons/modules/plantings.svg);
}
.App-NavBar .NavBar-Tab-icon-seedbox
{
    background-image: url(../icons/modules/seedbox.svg);
}
.App-NavBar .NavBar-Tab-icon-journal
{
    background-image: url(../icons/modules/journal.svg);
}
.App-NavBar .NavBar-Tab-icon-growspaces
{
    background-image: url(../icons/modules/growspaces.svg);
}
.App-NavBar-info,
.App-NavBar-export
{
    display: flex;

    padding: 10px;

    cursor: pointer;

    align-items: center;
}

 */

