import React from 'react'
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, Dimensions } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation'
import { Camera, Permissions } from 'expo'
import { purple, white } from './utils/colors'

import DetectionMode from './components/DetectionMode'
import NearbyLocations from './components/NearbyLocations'
import Recommendations from './components/Recommendations'
import ExplorationMode from './components/ExplorationMode'

import { connect } from 'react-redux'
import { loadSettings, setSettings } from './actions'


const MainNavigtor = StackNavigator({
  DetectionMode: { screen: DetectionMode },
  NearbyLocations: { screen: NearbyLocations },
  Recommendations: { screen: Recommendations },
  // ExplorationMode: {
  //   screen: Tabs,
  // }
}, {
  initialRouteName: 'NearbyLocations',
  navigationOptions: {
    header: null,
  },
})


class AppWithStore extends React.Component {

  defaultSettings = () => {
    let newSettings = {
      dectionLimit: 5,
      nearbyLimit: 10,
      nearbyRadius: 1000,
      category: 'religious'
    }
    this.props.changeSettings(newSettings)
  }



  componentDidMount () {
    this.props.loadSettings()

    setTimeout( () => {
      if (Object.keys(this.props.settings).length === 0) {
        this.defaultSettings()
      }
    }, 10000);

  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MainNavigtor/>
      </SafeAreaView>
    )
  }
}


mapStateToProps = (state) => {
  return {
    settings: state
  }
}

mapDispatchToProps = (dispatch) => {
  return {
    loadSettings: () => dispatch(loadSettings()),
    changeSettings: (settings) => dispatch(setSettings(settings))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWithStore)
