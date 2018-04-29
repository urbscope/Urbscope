import React from 'react'
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, Dimensions, AsyncStorage } from 'react-native'
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import { Camera, Permissions } from 'expo'

import { purple, white } from './utils/colors'
import { DEFAULT_SETTINGS } from './utils/helpers'

import DetectionMode from './components/DetectionMode'
import NearbyLocations from './components/NearbyLocations'
import Recommendations from './components/Recommendations'
import ExplorationMode from './components/ExplorationMode'
import SplashLoading from './components/SplashLoading'
import TabBarExploration from './components/TabBarExploration'

import { connect } from 'react-redux'
import { loadSettings, setSettings, getUserID } from './actions'
import { getUID, setUserID } from "./utils/localStorageAPI";
console.disableYellowBox = true;



import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

function TabBarCustom ({jumpToIndex, navigation, ...props}) {

  return (
    <TabBarBottom
      {...props}
      navigation={navigation}
      jumpToIndex={(index) => {
        // if (index === 3) {
        //   // or whatever index your menu button is
        //   navigation.navigate('DrawerOpen');
        // } else {
        //   jumpToIndex(index);
        // }
      }}
    />
  );
}


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
      // activeTintColor: 'tomato',
      // inactiveTintColor: 'gray',
      // showIcon: true,
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
  initialRouteName: 'DetectionMode',
  navigationOptions: ({ navigation }) => ({
    header: null,
  }),
})

// const MainNavigtor = StackNavigator({
//   DetectionMode: {
//     screen: DetectionMode,
//     navigationOptions: ({ navigation }) => ({
//       header: null,
//     }),
//   },
//   ExplorationMode: {
//     screen: ExplorationMode,
//     navigationOptions: ({ navigation }) => ({
//       header: null,
//     }),
//   },
//   ExplorationMode: {
//     screen: TabNavigator({
//       NearbyLocations: {
//         screen: NearbyLocations,
//         navigationOptions: ({ navigation }) => ({
//           title: 'Home',
//         }),
//       },
//       Recommendations: {
//         screen: Recommendations,
//         navigationOptions: ({ navigation }) => ({
//           title: 'My Friends',
//         }),
//       },
//     },{
//       lazy: true,
//       tabBarComponent: TabBarExploration,
//       tabBarPosition: 'bottom',
//       animationEnabled: true,
//     }),
//     navigationOptions: ({ navigation }) => ({
//       title: 'Exploration',
//     }),
//   },
// });

// const MainNavigtor = StackNavigator({
//   DetectionMode: { screen: DetectionMode },
//   NearbyLocations: { screen: NearbyLocations },
//   Recommendations: { screen: Recommendations },
//   // ExplorationMode: {
//   //   screen: Tabs,
//   // }
// }, {
//   initialRouteName: 'Recommendations',
//   navigationOptions: {
//     header: null,
//   },
// })


class AppWithStore extends React.Component {

  state = {
    loading: true,
  }

  async createUserID() {
    let uid = Expo.Constants.deviceId;
    let resp = await fetch(`https://urbserver.herokuapp.com/register/${uid}`);
    if (resp.status == 200){
      setUserID(uid);
    }

  }

  componentDidMount () {
    // AsyncStorage.clear()


    // this.props.loadUserID((id) => console.log(id))
    this.props.loadUserID()

    //   getUserID().then(id=>{
    //   if (!id)
    //     this.createUserID();
    //     }
    // );

    // getUID().then(id => {
    //   console.log("WORKSSSSS");
    //   console.log('id: ', id);
    //   if (!id)
    //     this.createUserID();
    //   }
    // );

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



  }

  render() {
    console.log(this.props.userID);
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
    userID: state.userID,
  }
}

mapDispatchToProps = (dispatch, { navigation }) => {
  return {
    loadSettings: (callback) => dispatch(loadSettings(callback)),
    changeSettings: (settings, callback) => dispatch(setSettings(settings, callback)),
    loadUserID: (callback) => dispatch(getUserID(callback)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWithStore)
