'use strict';

var React = require('react');
var cx = require('classnames');

var FattySheet = React.createClass({
  propTypes:{
    size: React.PropTypes.oneOf(['supersize', 'regular', 'value'])
  ,  theme: React.PropTypes.oneOf(['cream', 'white'])
  },

  getDefaultProps(){
    return {
      size: 'regular'
    ,  theme: 'cream'
    }
  },

  getInitialState(){
    return {
    }
  },


  render(){
    var {
      className,
      ...props
    } = this.props;

    var fieldClasses = cx(
      'Fatty'
    ,  'Fatty-Sheet'
    , 'Fatty-Sheet--'.concat(this.props.theme)
    , {
      'Fatty--regular':this.props.size==='regular',
      'Fatty--supersized': this.props.size==='supersize'
    });
    fieldClasses+=' '+(className || '');

    return (<div className={fieldClasses} {...props}>
      {this.props.children}
    </div>);
  }

});

module.exports = FattySheet;
