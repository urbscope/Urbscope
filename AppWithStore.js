import React from 'react'
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, Dimensions, AsyncStorage } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation'
import { Camera, Permissions } from 'expo'

import { purple, white } from './utils/colors'
import { DEFAULT_SETTINGS } from './utils/helpers'

import DetectionMode from './components/DetectionMode'
import NearbyLocations from './components/NearbyLocations'
import Recommendations from './components/Recommendations'
import ExplorationMode from './components/ExplorationMode'
import SplashLoading from './components/SplashLoading'

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
  initialRouteName: 'Recommendations',
  navigationOptions: {
    header: null,
  },
})


class AppWithStore extends React.Component {

  state = {
    loading: true,
  }

  // defaultSettings = () => {
  //   let newSettings = {
  //     dectionLimit: 5,
  //     nearbyLimit: 10,
  //     nearbyRadius: 1000,
  //     category: 'religious',
  //     themeColor: 'red',
  //   }
  //   this.props.changeSettings(newSettings)
  // }



  componentDidMount () {
    // AsyncStorage.clear()

    this.props.loadSettings(() => {
      // console.log("load settings init");
      // console.log(this.props);

      if (this.props.settings === null || this.props.settings === undefined) {
        this.props.changeSettings(DEFAULT_SETTINGS, () => {
          this.setState({ loading: false })
          // console.log("load default when props null or undefined");
        })
      } else {
        if (Object.keys(this.props.settings).length === 0 ) {
          this.props.changeSettings(DEFAULT_SETTINGS, () => {
            this.setState({ loading: false })
            // console.log("load default when props empty");
          })
        } else {
          // console.log("load settings success");
          this.setState({ loading: false })
        }
      }
    })


    // await this.props.loadSettings()

      // if (Object.keys(this.props.settings).length === 0) {
      //   this.defaultSettings()
      // }
  }

  render() {
    if (this.state.loading) {
      return (
        <SplashLoading />
      )
    } else {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <MainNavigtor/>
        </SafeAreaView>
      )
    }
  }
}


mapStateToProps = (state) => {
  return {
    settings: state.settings,
    themeColor: state.themeColor,
  }
}

mapDispatchToProps = (dispatch) => {
  return {
    loadSettings: (callback) => dispatch(loadSettings(callback)),
    changeSettings: (settings, callback) => dispatch(setSettings(settings, callback))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWithStore)
