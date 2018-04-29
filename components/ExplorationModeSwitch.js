import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { buttonActive, buttonActiveOutline, activeTint, inactiveTint } from '../utils/colors'

import { connect } from 'react-redux';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

class ExplorationModeSwitch extends Component {

  goToRecommendations = () => {

    this.props.changeScreen('Recommendations')
    // this.props.dispatch(NavigationActions.reset({
    //   index: 0,
    //   actions: [ NavigationActions.navigate({ routeName: 'Recommendations'}) ]
    // }))

    // console.log("go to Recommendations");
  }

  goToNearbyLocations = () => {

    this.props.changeScreen('NearbyLocations')

    // this.props.dispatch(NavigationActions.reset({
    //   index: 0,
    //   actions: [ NavigationActions.navigate({ routeName: 'NearbyLocations'}) ]
    // }))

    // console.log("go to NearbyLocations");
  }

  doNothing = () => {}

  render(){

    const { currentScreen, themeColor } = this.props

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

    console.log(currentScreen);
    // style={[styles.squareButton1, isSelectedNearbyLocations]}
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{width: '50%', justifyContent: 'center', alignItems: 'center'}}
          onPress={currentScreen === 'NearbyLocations' ? this.doNothing : this.goToNearbyLocations }
        >
          <FontAwesome
            name={currentScreen === 'NearbyLocations' ? 'circle' : 'circle-thin'}
            size={10}
            color={currentScreen === 'NearbyLocations' ? themeColor : '#888'}
          />

          <Text style={currentScreen === 'NearbyLocations'
            ? {color: themeColor, fontSize: 11, fontWeight: '200', padding: 5}
            : {color: '#888', fontSize: 11, fontWeight: '200', padding: 5}
          }>
            Map
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{width: '50%', justifyContent: 'center', alignItems: 'center'}}
          onPress={currentScreen === 'NearbyLocations' ? this.goToRecommendations : this.doNothing }
        >
          <FontAwesome
            name={currentScreen === 'NearbyLocations' ? 'circle-thin' : 'circle'}
            size={10}
            color={currentScreen === 'NearbyLocations' ? '#888' : themeColor}
          />
          <View >
            <Text style={currentScreen === 'NearbyLocations'
              ? {color: '#777', fontSize: 11, fontWeight: '200', padding: 5}
              : {color: themeColor, fontSize: 11, fontWeight: '200', padding: 5}
            }>
              Recommendations
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    width: '80%',
    bottom: 0,
    left: '10%',
    right: 0,
    zIndex: 1,
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


mapStateToProps = (state) => {
  return {
    settings: state.settings,
    themeColor: state.themeColor,
  }
}

export default connect(mapStateToProps)(ExplorationModeSwitch)
