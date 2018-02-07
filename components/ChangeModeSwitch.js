import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { purple, white } from '../utils/colors'

class ChangeModeSwitch extends Component {

  goToDetection = () => {
    // this.props.changeScreen('DetectionMode')

    this.props.dispatch(NavigationActions.reset({
      index: 0,
      actions: [ NavigationActions.navigate({ routeName: 'DetectionMode'}) ]
    }))

    // this.props.dispatch(NavigationActions.replace({
    //   key: 'NearbyLocations',
    //   routeName: 'DetectionMode'
    // }))


    console.log("go to detection");
  }

  goToExploration = () => {

    // this.props.changeScreen('NearbyLocations')

    this.props.dispatch(NavigationActions.reset({
      index: 0,
      actions: [ NavigationActions.navigate({ routeName: 'NearbyLocations'}) ]
    }))
    
    // this.props.dispatch(NavigationActions.replace({
    //   key: 'DetectionMode',
    //   newKey: 'NearbyLocations',
    //   routeName: 'NearbyLocations'
    // }))

    console.log("go to exploration");
  }

  doNothing = () => {}

  render(){

    const { currentScreen } = this.props

    let isSelectedDetection
    let isSelectedExploration
    if (currentScreen === 'DetectionMode'){
      isSelectedDetection = styles.selected
      isSelectedExploration = styles.unselected
    } else {
      isSelectedDetection = styles.unselected
      isSelectedExploration = styles.selected
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

export default ChangeModeSwitch

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
    borderColor: white,
    marginTop: 10,
  },
  selected: {
    backgroundColor: purple
  },
  unselected: {
    backgroundColor: 0,
  }
})
