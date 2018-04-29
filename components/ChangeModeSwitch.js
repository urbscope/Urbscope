import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import { buttonActive, buttonActiveOutline } from '../utils/colors'

import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';


class ChangeModeSwitch extends Component {

  goToDetection = () => {
    // this.props.changeScreen('DetectionMode')

    // this.props.dispatch(NavigationActions.reset({
    //   index: 0,
    //   actions: [ NavigationActions.navigate({ routeName: 'DetectionMode'}) ]
    // }))

    // this.props.replaceScreen('DetectionMode')

    // this.props.changeScreennn('DetectionMode')
    // this.props.dispatch(NavigationActions.replace({
    //   key: 'NearbyLocations',
    //   routeName: 'DetectionMode'
    // }))

    this.props.dispatch(NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'DetectionMode' })],

    }))

    // console.log("go to detection");
  }

  goToExploration = () => {

    // this.props.changeScreen('NearbyLocations')

    // this.props.dispatch(NavigationActions.reset({
    //   index: 0,
    //   actions: [ NavigationActions.navigate({ routeName: 'NearbyLocations'}) ]
    // }))

    // this.props.replaceScreen('ExplorationMode')

    // this.props.changeScreennn('ExplorationMode')

    // this.props.dispatch(NavigationActions.replace({
    //   key: 'DetectionMode',
    //   newKey: 'NearbyLocations',
    //   routeName: 'NearbyLocations'
    // }))


    this.props.dispatch(NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'ExplorationMode' })],
    }))

    // console.log("go to exploration");
  }

  doNothing = () => {}

  render(){


    const { currentScreen, themeColor } = this.props

    // let isSelectedDetection
    // let isSelectedExploration
    // if (currentScreen === 'DetectionMode'){
    //   isSelectedDetection = { backgroundColor: themeColor }
    //   isSelectedExploration = { backgroundColor: 0 }
    // } else {
    //   isSelectedDetection = { backgroundColor: 0 }
    //   isSelectedExploration = { backgroundColor: themeColor }
    // }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={currentScreen === 'DetectionMode' ? this.doNothing : this.goToDetection }
        >
          <View style={[styles.button]}>
            <View style={styles.buttonLogoContainer}>
              <MaterialIcons
                name='flag'
                size={30}
                color={currentScreen === 'DetectionMode' ? '#eee' : '#eee'}
                />
            </View>
            <View style={currentScreen === 'DetectionMode'
              ? [styles.buttonLine, {backgroundColor: '#eee'}]
              : [styles.buttonLine, {backgroundColor: themeColor}]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={currentScreen === 'DetectionMode' ? this.goToExploration : this.doNothing }
        >
          <View style={[styles.button]}>
            <View style={styles.buttonLogoContainer}>
              <MaterialIcons
                name='explore'
                size={30}
                color={currentScreen === 'DetectionMode' ? '#eee' : '#eee'}

                />
            </View>

            <View style={currentScreen === 'DetectionMode'
              ? [styles.buttonLine, {backgroundColor: themeColor}]
              : [styles.buttonLine, {backgroundColor: '#eee'}]} />

          </View>
        </TouchableOpacity>


      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top:  75,
    right: 15,
  },
  button: {
    height: 60,
    width: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    // borderRadius: 20,
    // borderWidth: 0.5,
    marginTop: 10,
  },
  buttonLine: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    width: 10,
  },
  buttonLogoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})



mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor,
  }
}

mapDispatchToProps = (dispatch, { navigation }) => {
  return {
    // changeScreennn: (name, params, actions) => navigation.replace(name, params, actions),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeModeSwitch)
