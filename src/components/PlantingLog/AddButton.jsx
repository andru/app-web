import React, {Component, PropTypes} from 'react'
import {StyleSheet} from 'react-native-web'

import {View} from 'components/View'
import {IconButton} from 'components/Buttons'

const defaultStyles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 10
  },
  hotKey: {
    flexDirection: 'row',
    flexBasis: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hotKeyPart: {
    fontFamily: '"Helvetica Neue", sans-serif',
    fontSize: 14,
    color: '#818076',
    borderWidth: 2,
    borderColor: '#818076',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonBase: {
    flexBasis: 40,
    flexGrow: 0,
    flexShrink: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#52ad59'
  },
  button: {
    fontSize: 25,
    width: 40,
    height: 40,
    marginTop: -3,
    color: '#FFF',
    borderRadius: 20,
    backgroundColor: '#78c76d',
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    fontSize: 22,
    fontWeight: 700,
    color: '#5e5d55',
    flexGrow: 1,
    flexShrink: 1,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10
  }
})

export default class AddEventButton extends Component{
  static propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.oneOf(['add']),
    keys: PropTypes.array,
    onClick: PropTypes.func,
    styles: PropTypes.object
  };
  static defaultProps = {
    styles: defaultStyles,
    keys: []
  };

  handleClick = () => {
    this.props.onClick
  };

  render () {
    let {
      label,
      icon,
      keys,
      styles,
      ...props
    } = this.props;

    return (
      <View style={styles.container}
      onClick={this.handleClick}
      {...props}>
        {keys &&
        <View style={styles.hotKey}>
          {keys.map(key=>(
            typeof key === 'string'
              ? <View style={styles.hotKeyPart}>
                  {key}
                </View>
              : <View style={styles.hotKeyPart}>
                  {key}
                </View>
          ))}
        </View>
        }
        <View style={styles.buttonBase}>
        <View style={styles.button}>
          {icon}
        </View>
        </View>
        <View className="Planting-Timeline-Button-label">{label}</View>
      </View>
    )
  }
}
