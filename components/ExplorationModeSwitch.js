import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { buttonActive, buttonActiveOutline, activeTint, inactiveTint } from '../utils/colors'

class ExplorationModeSwitch extends Component {

  goToRecommendations = () => {

    this.props.dispatch(NavigationActions.reset({
      index: 0,
      actions: [ NavigationActions.navigate({ routeName: 'Recommendations'}) ]
    }))

    // console.log("go to Recommendations");
  }

  goToNearbyLocations = () => {

    this.props.dispatch(NavigationActions.reset({
      index: 0,
      actions: [ NavigationActions.navigate({ routeName: 'NearbyLocations'}) ]
    }))

    // console.log("go to NearbyLocations");
  }

  doNothing = () => {}

  render(){

    const { currentScreen } = this.props

    let isSelectedNearbyLocations
    let isSelectedRecommendations

    if (currentScreen === 'NearbyLocations'){
      isSelectedNearbyLocations = styles.selected
      isSelectedRecommendations = styles.unselected
      isSelectedNearbyLocationsText = styles.selectedText
      isSelectedRecommendationsText = styles.unselectedText
    } else {
      isSelectedNearbyLocations = styles.unselected
      isSelectedRecommendations = styles.selected
      isSelectedNearbyLocationsText = styles.unselectedText
      isSelectedRecommendationsText = styles.selectedText
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.squareButton1, isSelectedNearbyLocations]}
          onPress={currentScreen === 'NearbyLocations' ? this.doNothing : this.goToNearbyLocations }
        >
          <View>
            <Text style={isSelectedNearbyLocationsText}>Nearby Locations</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.squareButton2, isSelectedRecommendations]}
          onPress={currentScreen === 'NearbyLocations' ? this.goToRecommendations : this.doNothing }
        >
          <View >
            <Text style={isSelectedRecommendationsText}>Recommendations</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

export default ExplorationModeSwitch

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    width: '70%',
    top: '5%',
    left: '10%',
    right: 0,
  },
  squareButton1: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: '50%',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: buttonActive,
  },
  squareButton2: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: '50%',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: buttonActive,
  },
  selected: {
    backgroundColor: buttonActive
  },
  unselected: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  selectedText: {
    color: activeTint
  },
  unselectedText: {
    color: inactiveTint,
  }
})
