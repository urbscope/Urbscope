import React from 'react'
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, Dimensions, AsyncStorage } from 'react-native'
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import { Camera, Permissions } from 'expo'

// import { purple, white } from './utils/colors'
import { DEFAULT_SETTINGS } from './utils/helpers'

import DetectionMode from './components/DetectionMode'
import NearbyLocations from './components/NearbyLocations'
import Recommendations from './components/Recommendations'
// import ExplorationMode from './components/ExplorationMode'
import SplashLoading from './components/SplashLoading'
import TabBarExploration from './components/TabBarExploration'

import { connect } from 'react-redux'
import {changeColor, loadSettings, setSettings} from './actions'
import {getUserID, setUserID} from "./utils/localStorageAPI";
console.disableYellowBox = true;



import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';



const Tabs = TabNavigator({
    NearbyLocations: {
      screen: NearbyLocations
    },
    Recommendations: { screen: Recommendations },
  },
  {
    // navigationOptions: ({ navigation }) => ({
    //
    //   tabBarIcon: ({ focused, tintColor }) => {
    //     // console.log(TabBarBottom);
    //     const { routeName } = navigation.state;
    //     let iconName;
    //     if (routeName === 'NearbyLocations') {
    //       iconName = `circle${focused ? '' : '-thin'}`;
    //     } else if (routeName === 'Recommendations') {
    //       iconName = `circle${focused ? '' : '-thin'}`;
    //     }
    //     return <FontAwesome
    //       name={iconName} size={7} color={tintColor}
    //       style={{padding: 0}}
    //
    //       />
    //   },
    // }),
    tabBarOptions: {
      showLabel: true,
      lazyLoad: true,
      upperCaseLabel: false,
      allowFontScaling: true,
    },

    lazy: true,
    tabBarComponent: TabBarExploration,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    // swipeEnabled: true,
  }
)
const MainNavigtor = StackNavigator({
  DetectionMode: { screen: DetectionMode },
  ExplorationMode: { screen: Tabs },
}, {
  initialRouteName: 'ExplorationMode',
  navigationOptions: ({ navigation }) => ({
    header: null,
  }),
})



class AppWithStore extends React.Component {

  state = {
    loading: true,
  }

  async createUserID() {
    let uid = Expo.Constants.deviceId;
    console.log("generated ID ", uid);
    let resp = await fetch(`https://urbserver.herokuapp.com/register/${uid}`);
    if (resp.status == 200){
      setUserID(uid);
    }else {
      console.error("response status: ", res.status);
    }

  }

  componentDidMount () {
    // AsyncStorage.removeItem("settingsstorage");
    // AsyncStorage.clear()



    // this.props.loadUserID((id) =>console.log(this.props.userID));
    // this.props.loadUserID();

    //   getUserID().then(id=>{
    //   if (!id)
    //     this.createUserID();
    //     }
    // );

    getUserID().then(id=>{
        // console.log("user id: ", id);
        if (!id)
          this.createUserID();
      }
    );

    this.props.loadSettings(() => {
      //console.log("AppWithStore:load settings init");
      //console.log("this.props.settings: ", this.props.settings);

      if (this.props.settings === null || this.props.settings === undefined) {
          this.props.changeColor(DEFAULT_SETTINGS.themeColor);
          this.props.changeSettings(DEFAULT_SETTINGS, () => {
            this.setState({ loading: false })
          // console.log("load default when props null or undefined");
          })
      } else {
        if (Object.keys(this.props.settings).length === 0 ) {
            this.props.changeColor(DEFAULT_SETTINGS.themeColor);
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



  }

  render() {
    // console.log(this.props.userID);
    if (this.state.loading) {
      return (
        <SplashLoading />
      )
    } else {
      return (
        <View style={{ flex: 1 }}>
          <MainNavigtor/>
        </View>
      )
    }
  }

}


mapStateToProps = (state) => {
  return {
    settings: state.settings,
    themeColor: state.themeColor,
    userID: state.userID,
  }
}

mapDispatchToProps = (dispatch, { navigation }) => {
  return {
    loadSettings: (callback) => dispatch(loadSettings(callback)),
    changeColor: (color) => dispatch(changeColor(color)),
    changeSettings: (settings, callback) => dispatch(setSettings(settings, callback)),
    loadUserID: (callback) => dispatch(getUserID(callback)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWithStore)
