import React, { Component } from 'react'
import { View, Text, StyleSheet, LayoutAnimation } from 'react-native'
import ChangeModeSwitch from './ChangeModeSwitch'
import ExplorationModeSwitch from './ExplorationModeSwitch'
import { Constants, Location, Camera, Permissions, MapView } from 'expo'
import { venues } from 'react-foursquare'

var foursquare = require('react-foursquare')({
  clientID: 'EECH5IF2TSK01WV2DQUKIRNT5CUVRTH0AVVDFM521E32ZVPH',
  clientSecret: '1LL20JSTUVM1BM4G30E0KMN1QBKU3ZDVLMO1OP5QIPWCQEOK'
})

class NearbyLocations extends Component {
  state = {
    hasCameraPermission: null,
    location: null,
  }

  componentDidMount() {
    LayoutAnimation.linear()
    this.setState({});
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);

    this.setState({ hasCameraPermission: status === 'granted' });

    this.getLocationAsync()

    console.log(foursquare);

    foursquare.venues.explore({
      "ll": '41.006330,28.978198',
      "query": 'History',
      radius: 1000,
      limit: 10
    }).then(res => {
        // console.log(res.response.groups[0].items)
      })
  }

  getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    Location.watchPositionAsync({
      enableHighAccuracy: true,
      timeInterval: 900000,
      distanceInterval: 500,
    }, (location) => {
      console.log(location);
      try {
        this.setState({location})
      } catch (e) {
        console.error("No setState", e);
      }
    })
  };

  render(){



    return (
        <View style={{ flex: 1 }}>
          <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
       </View>
     )

    // const { navigation } = this.props
    //
    // const { hasCameraPermission, location } = this.state

    // if ((hasCameraPermission === null) && (location === null)) {
    //   return <View />;
    // } else if (hasCameraPermission === false) {
    //   return <Text>No access to camera</Text>;
    // } else if ((location === null)) {
    //   return (
    //     <View>
    //       <Text> Wait for location</Text>
    //     </View>
    //   )
    // } else {
    //
     //  return (
     //    <View style={{ flex: 1 }}>
     //      <Camera style={styles.camera} type={Camera.Constants.Type.back}>
     //        <View
     //          style={styles.container}>
     //          <ExplorationModeSwitch
     //            currentScreen={navigation.state.routeName}
     //            changeScreen={navigation.navigate}
     //            dispatch={navigation.dispatch}
     //          />
     //          <Text style={styles.coords}>{location.coords.latitude}, {location.coords.longitude}</Text>
     //          <ChangeModeSwitch
     //            currentScreen={navigation.state.routeName}
     //            changeScreen={navigation.navigate}
     //            dispatch={navigation.dispatch}
     //         />
     //       </View>
     //     </Camera>
     //   </View>
     // )

  }
}

export default NearbyLocations

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  coords: {
    alignSelf: 'center',
    height: 40,
    fontSize: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.6)'
  },
  camera: {
    flex: 1
  }
})
