import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'

import { buttonActive, buttonActiveOutline } from '../utils/colors'

class ChangeModeSwitch extends Component {

  goToDetection = () => {
    // this.props.changeScreen('DetectionMode')

    // this.props.dispatch(NavigationActions.reset({
    //   index: 0,
    //   actions: [ NavigationActions.navigate({ routeName: 'DetectionMode'}) ]
    // }))

    this.props.replaceScreen('DetectionMode')

    // this.props.dispatch(NavigationActions.replace({
    //   key: 'NearbyLocations',
    //   routeName: 'DetectionMode'
    // }))


    console.log("go to detection");
  }

  goToExploration = () => {

    // this.props.changeScreen('NearbyLocations')

    // this.props.dispatch(NavigationActions.reset({
    //   index: 0,
    //   actions: [ NavigationActions.navigate({ routeName: 'NearbyLocations'}) ]
    // }))
    
    this.props.replaceScreen('NearbyLocations')

    // this.props.dispatch(NavigationActions.replace({
    //   key: 'DetectionMode',
    //   newKey: 'NearbyLocations',
    //   routeName: 'NearbyLocations'
    // }))

    console.log("go to exploration");
  }

  doNothing = () => {}

  render(){
    console.log(this.props);
    const { currentScreen, themeColor } = this.props

    let isSelectedDetection
    let isSelectedExploration
    if (currentScreen === 'DetectionMode'){
      isSelectedDetection = { backgroundColor: themeColor }
      isSelectedExploration = { backgroundColor: 0 }
    } else {
      isSelectedDetection = { backgroundColor: 0 }
      isSelectedExploration = { backgroundColor: themeColor }
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.roundButton, isSelectedDetection]}
          onPress={currentScreen === 'DetectionMode' ? this.doNothing : this.goToDetection }
        >
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roundButton, isSelectedExploration]}
          onPress={currentScreen === 'DetectionMode' ? this.goToExploration : this.doNothing }
        >
        </TouchableOpacity>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '10%',
    right: '2%',
  },
  roundButton: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: buttonActiveOutline,
    marginTop: 10,
  },
  selected: {
    backgroundColor: buttonActive
  },
  unselected: {
    backgroundColor: 0,
  }
})



mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor,
  }
}

export default connect(mapStateToProps)(ChangeModeSwitch)
