import React, {Component} from 'react'
import { Dimensions,
         View,
         SafeAreaView,
         Text,
         StyleSheet,
         LayoutAnimation,
         TouchableOpacity,
         Animated,
         PanResponder } from 'react-native'

import ChangeModeSwitch from './ChangeModeSwitch'
import ExplorationModeSwitch from './ExplorationModeSwitch'
import { Constants, Location, Camera, Permissions, MapView } from 'expo'
import { venues } from 'react-foursquare'
import MapViewDirections from 'react-native-maps-directions';
import Marker from './CustomMarker'
import * as polyline from '@mapbox/polyline';
import geolib from 'geolib';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { connect } from 'react-redux'
import DirectionMeter from './DirectionMeter'
import Settings from './Settings'

import { purple, white, red } from '../utils/colors'
import {updateVisitedLocations} from "../utils/localStorageAPI";
import NearbyLocationsList from "./NearbyLocationsList";

var foursquare = require('react-foursquare')({
  clientID: 'EECH5IF2TSK01WV2DQUKIRNT5CUVRTH0AVVDFM521E32ZVPH',
  clientSecret: '1LL20JSTUVM1BM4G30E0KMN1QBKU3ZDVLMO1OP5QIPWCQEOK'
})

let GOOGLE_MAPS_APIKEY = "AIzaSyCOFvXSiK0tMiDIXbWpUaj5s89lMh55Ov4";

// Get Screen Dimensions
const ScreenHeight = Dimensions.get('window').height
const ScreenWidth  = Dimensions.get('window').width


class NearbyLocations extends Component {

  constructor(props) {
    super(props);

    this.state = {
      hasCameraPermission: null,
      location: null,
      markers: {},
      selectedMarker: null,
      destination: null,
      arrowRotation: null,
      showArrow: true,
      distanceToDestinationText: null,
      distanceToDestinationMeters: null,
      settingVisible: false,
      mapViewPosition: new Animated.ValueXY(),
    };

    this.heading = null;
    this.targetBearing = null; //Angle between current location and targetDestination


    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      // Initially, set the value of x and y to 0 (the center of the screen)
      onPanResponderGrant: (e, gestureState) => {
        this.state.mapViewPosition.setOffset({x: this.state.mapViewPosition.x._value, y: this.state.mapViewPosition.y._value});
        this.state.mapViewPosition.setValue({x: 0, y: 0});
      },

      // When we drag/pan the object, set the delate to the states pan position
      onPanResponderMove: Animated.event([
        null, {dx: this.state.mapViewPosition.x, dy: 0},
      ]),

      onPanResponderRelease: (e, {moveX, vx}) => {
        this.state.mapViewPosition.flattenOffset();
        if (moveX < ScreenWidth*0.4 || vx < -1.5) {
          Animated.spring(this.state.mapViewPosition, { toValue: {x: 0, y: 0}, friction: 7, tension: 20}).start();
        }
        if (moveX > ScreenWidth*0.4 || vx > 2) {
          Animated.spring(this.state.mapViewPosition, { toValue: {x: ScreenWidth-20, y: 0}, friction: 7, tension: 20}).start();
        }

      }

    })
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.settings) != JSON.stringify(nextProps.settings)){
      this.fetchMarkers(nextProps.settings);
    }
  }

  async fetchMarkers(settings ){
    // console.log(settings);

    let location = await this._getLocationAsync();
    // console.log(location);

    //TODO: add relevant category + ALL category
    let url = "https://urbserver.herokuapp.com/landmark?"
    + "inLL=" + this.formatLocation(location, false)
    + "&inLimit=" + settings.nearbyLimit
    + "&inCat=" + settings.category
    + "&inRadius=" + settings.nearbyRadius;

    console.log(url);

    fetch(url).then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Landmark search error!');
      }
    })
    .then(responseJson => {

      let landmarks = responseJson.landmarks;
      let markers = {};
      for (obj of landmarks){
          coords = {lat: obj.latitude, lng: obj.longitude};
          markers[obj.destinationID] =  {
              name: obj.name.toString(),
              category: obj.category,
              picture: obj.picture,
              location: {latitude: coords.lat, longitude: coords.lng},
              key: obj.destinationID.toString(),
              address: obj.address
          }
      }
      this.setState({
        markers: markers
      })
    })
    .catch(error => {
      // console.error(error);
    });

  }

async componentDidMount() {
    LayoutAnimation.linear();

    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
    this._watchHeadingAsync();
    this._watchTargetBearingAsync();
    let location = await this._getLocationAsync();
    if (this.props.settings) {
        this.fetchMarkers(this.props.settings);
    }

    if (this.props.navigation.state.params) {
      this.setState({showArrow: true})
      console.log(this.props.navigation.state.params);
      setTimeout(() => {
        Animated.spring(this.state.mapViewPosition, { toValue: {x: ScreenWidth-20, y: 0}, friction: 7, tension: 20}).start();

      }, 1000)
    }
  }


  _getLocationAsync = async () => {
    let {status} = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({location});
    return location;
  };


  //Will get device heading, sets as this.heading. If Navigation is taking place, ie, this.targetBearing not null:
  // set this.arrowRotation = 360 - this.heading + targetBearing;
  _watchHeadingAsync = async () => {
    this.headingWatch = await Location.watchHeadingAsync((res) => {
      this.setState({north: res.magHeading})
      this.heading = res.magHeading;

      //If Navigate is on, calculate arrowRotation angle
      if (this.targetBearing) {
        let arrowRotation = 360 - this.heading + this.targetBearing;
        if (arrowRotation > 360)
          arrowRotation -= 360;
        this.setState({arrowRotation});
      }
    });
  };



  formatLocation(location, asObject = true) {
    if (!location)
    return null;
    else if (asObject) {
      if (location.coords)
      return {latitude: location.coords.latitude, longitude: location.coords.longitude};
      else
      return {latitude: location.latitude, longitude: location.longitude};
    }
    else {
      if (location.coords)
      return "" + location.coords.latitude + "," + location.coords.longitude;
      else
      return "" + location.latitude + "," + location.longitude;
    }
  }

  componentWillUnmount() {
    this.headingWatch.remove();
    clearInterval(this.targetBearingWatchId);

  }

  getTargetBearingAndDistance = async () => {

    let startLoc = this.formatLocation(this.state.location, false);
    let destinationLoc = this.formatLocation(this.state.destination, false);
    if (!destinationLoc || !startLoc) {
      // console.log("location null. returning");
      return;
    }

    try {
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?mode=walking&origin=${ startLoc }&destination=${ destinationLoc }`);
      let respJson = await resp.json();

      if (!respJson.routes || !respJson.routes[0] || !respJson.routes[0].legs || !respJson.routes[0].overview_polyline || !respJson.routes[0].overview_polyline.points) {
        // console.log(respJson);
        // console.log("respjson polylines null.returning");
        return;
      }

      let distanceToDestination = respJson.routes[0].legs[0].distance;
        this.setState({
          distanceToDestinationText: distanceToDestination.text,
          distanceToDestinationMeters: distanceToDestination.value
      });

      respJson = respJson.routes[0].overview_polyline.points;
      let points = polyline.decode(respJson);
      if (!points || !points[1])
      return;

      let pointCoords = {latitude: points[0][0], longitude: points[0][1]};
      this.targetBearing = geolib.getRhumbLineBearing(this.formatLocation(this.state.location), pointCoords);

      if (distanceToDestination.value <= 100)
        this.addVisitedLocation();

    } catch (error) {
      console.error(error);
    }
  };


  addVisitedLocation = ()=>{
      let id = this.state.selectedMarker ;
      if (id){
          let obj = Object.assign({}, this.state.markers[id], {rating: null, description: null});
          let entry = { [id]: obj };
          updateVisitedLocations(entry);
      }
  };


  _watchTargetBearingAsync = async () => {
    //Periodically updates targetBearing
    this.targetBearingWatchId = setInterval(async () => {
      // console.log("targetBearingWatchId firing now")
      this.getTargetBearingAndDistance();
    }, 15000);
  };


  closeSettings = () => {
    this.setState({settingVisible: false})
  }


  openSettings = () => {
    this.setState({settingVisible: true})
  }

  render() {

    const { navigation, settings, themeColor } = this.props

    const { hasCameraPermission, location, settingVisible, mapViewPosition, showArrow } = this.state


    // console.log(this.props.navigation);

    let [translateX, translateY] = [mapViewPosition.x, mapViewPosition.y];
    let imageStyle = {transform: [{translateX}, {translateY}]};

    let latlong = null;
    if (location != null) {
      latlong = {latitude: location.coords.latitude, longitude: location.coords.longitude};
    }

    if ((hasCameraPermission === null) && (location === null)) {
      return <View style={{flex:1, backgroundColor: 'black'}}/>;
    } else if (hasCameraPermission === false) {
      return (
        <View style={{flex:1, backgroundColor: 'black'}}>
          <Text>No access to camera</Text>
        </View>

      )
    } else if ((location === null)) {
      return (
        <View style={{flex:1, backgroundColor: 'black'}}>
          <Text> Wait for location</Text>
        </View>
      )
    } else {
      return (
        <SafeAreaView style={{flex: 1}}>
          <Camera style={styles.camera} type={Camera.Constants.Type.back}>
            <View
              style={styles.container}>

            {/*
              <ExplorationModeSwitch
                currentScreen={navigation.state.routeName}
                changeScreen={navigation.navigate}
                dispatch={navigation.dispatch}
                />
*/}
            <ChangeModeSwitch
                replaceScreen={navigation.replace}
                currentScreen={navigation.state.routeName}
                changeScreen={navigation.navigate}
                dispatch={navigation.dispatch}
                changeScreennn={this.props.changeScreennn}
                />

              <DirectionMeter
                  bearing={this.state.arrowRotation}
                  visible={showArrow}
              />



                <NearbyLocationsList locations={Object.values(this.state.markers)} handlePress={(key) => {
                    let loc = this.state.markers[key].location;
                    this.setState({
                        destination: loc,
                        selectedMarker: key
                    }, this.getTargetBearingAndDistance);
                }}/>


              <Animated.View
                style={[styles.mapWindow, imageStyle]}>

                <View style={[styles.mapWindowDrag, {backgroundColor: themeColor}]}
                {...this._panResponder.panHandlers}>
                  <View style={styles.mapWindowDragLine}>
                  </View>
                </View>


                <MapView ref={ref => this.mapRef = ref} style={styles.map}
                  provider={MapView.PROVIDER_GOOGLE}
                  showsUserLocation={true}
                  showsMyLocationButton={true}
                  followsUserLocation={true}
                  onPress={() => {
                    this.targetBearing = null;
                    this.setState({
                        destination: null,
                        selectedMarker: null,
                        distanceToDestinationMeters: null,
                        distanceToDestinationText: null,
                        arrowRotation:null
                    });
                  }}

                   onMapReady={()=>this.mapRef.animateToRegion({
                       latitude: location.coords.latitude,
                       longitude: location.coords.longitude,
                       latitudeDelta: 0.005,
                       longitudeDelta: 0.005
                   })}

                  >

                  <MapViewDirections
                    origin={latlong}
                    destination={this.state.destination}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    mode="walking"
                    strokeColor="hotpink"
                    />

                  {Object.values(this.state.markers).map(marker => (
                    <Marker
                      key={marker.key}
                      id ={marker.key}
                      coordinate={marker.location}
                      title={marker.name}
                      onPress={e => {
                        this.setState({
                          destination: e.location,
                          selectedMarker: e.id,
                        }, this.getTargetBearingAndDistance);
                      }}
                      />
                  ))}

                </MapView>

              </Animated.View>


              <TouchableOpacity
                onPress={settingVisible
                  ? this.closeSettings
                  : this.openSettings}
                style={styles.buttonSettingsContainer}
              >
                <View style={styles.buttonSettings}>
                  <View style={styles.buttonLogoContainer}>
                    <MaterialIcons
                      name='menu'
                      size={30}
                      color={'#eee'}

                      />
                  </View>

                  <View style={[styles.buttonLine, {backgroundColor: themeColor}]} />

                </View>
              </TouchableOpacity>

{
              // <TouchableOpacity
              //   onPress={settingVisible
              //     ? this.closeSettings
              //     : this.openSettings}
              //     style={[styles.buttonSettings, {backgroundColor: themeColor}]}
              //     >
              //     <Ionicons
              //       name='ios-settings-outline'
              //       size={50}
              //       color={white}
              //       />
              //   </TouchableOpacity>
}
                <Settings
                  visible={settingVisible}
                  />

              </View>
            </Camera>
          </SafeAreaView >
        )
      }
    }
  }


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      flexDirection: 'row',
    },
    coords: {
      alignSelf: 'center',
      height: 50,
      fontSize: 19,
      backgroundColor: 'rgba(255, 255, 255, 0.6)'
    },
    camera: {
      flex: 1
    },
    mapWindow: {
      position: 'absolute',
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      // borderWidth: 1,
      left: - ScreenWidth + 20,
      borderColor: '#eee',
      // bottom: 25,
      width: '100%',
      height: 0.41 * ScreenHeight ,
      zIndex: 15,
      top: 0.43 * ScreenHeight ,
      shadowColor: '#000',
      shadowOffset: {
        width: 1,
        height: 1
      },
      shadowRadius: 3,
      shadowOpacity: 0.2,
    },
    mapWindowDrag: {
      // borderLeftWidth: 3,
      // borderLeftColor: '#444',
      position: 'absolute',
      right: 0,
      height: '100%',
      width: 20,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      zIndex: 2,
    },
    mapWindowDragLine: {
      height: '40%',
      width: 3,
      backgroundColor: '#eee',
      borderRadius: 2,
      left: 9,
      top: '30%',
    },
    map: {
      position: 'absolute',
      width: ScreenWidth - 20,
      height: '100%',
      left: 0,
      zIndex: 1,
      borderRadius: 1,
      borderColor: 'black',
    },
    buttonSettingsContainer: {
      position: 'absolute',
      top: 5,
      zIndex: 11,
      right: 15,
    },
    buttonSettings: {
      height: 60,
      width: 60,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      // borderRadius: 20,
      // borderWidth: 0.5,
      marginTop: 10,
    },
    buttonLine: {
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      width: 10,
    },
    buttonLogoContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  })


mapStateToProps = (state) => {
  return {
    settings: state.settings,
    themeColor: state.themeColor,
  }
}



export default connect(mapStateToProps)(NearbyLocations)
// export default connect(mapStateToProps)(NearbyLocations)
