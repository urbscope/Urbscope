import React from 'react'
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, Dimensions } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation'
import { Camera, Permissions } from 'expo'
import { purple, white } from './utils/colors'

import DetectionMode from './components/DetectionMode'
import NearbyLocations from './components/NearbyLocations'
import Recommendations from './components/Recommendations'
import ExplorationMode from './components/ExplorationMode'

// const Tabs = TabNavigator({
//   NearbyLocations: {
//     screen: NearbyLocations,
//     navigationOptions: {
//       tabBarLabel: 'Nearby Locations',
//     }
//   },
//   Recommendations: {
//     screen: Recommendations,
//     navigationOptions: {
//       tabBarLabel: 'Recommendations',
//     }
//   }
// }, {
//   navigationOptions: {
//     header: null,
//   },
//   tabBarPosition: 'bottom',
//   animationEnabled: false,
//   swipeEnabled: true,
//   tabBarOptions: {
//     activeTintColor: white,
//     activeBackgroundColor: purple,
//     inactiveTintColor: purple,
//     inactiveBackgroundColor: 'transparent',
//     indicatorStyle: {
//       backgroundColor: 'transparent',
//       height: 0,
//     },
//     labelStyle: {
//       fontSize: 12,
//     },
//     style: {
//       // position: 'absolute',
//       // bottom: Dimensions.get('window').height - 175,
//       alignSelf: 'center',
//       height: 30,
//       width: '80%',
//       padding: 0,
//       backgroundColor: 0,
//     },
//     tabStyle: {
//       borderWidth: 1,
//       padding: 5,
//       borderColor: purple,
//     }
//   }
// })

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


export default class App extends React.Component {

  render() {


    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MainNavigtor/>
      </SafeAreaView>
    )
  }
}
