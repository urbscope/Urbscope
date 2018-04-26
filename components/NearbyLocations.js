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
      heading: 240,
      north: 0,
      hasCameraPermission: null,
      location: null,
      markers: [],
      destination: null,
      settingVisible: false,
      mapViewPosition: new Animated.ValueXY(),
    };

    this.heading = null;
    this.targetBearing = null; //Angle between current location and targetDestination
    this.arrowRotation = null;


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
        if (moveX < ScreenWidth/3 || vx < -2) {
          Animated.spring(this.state.mapViewPosition, { toValue: {x: 0, y: 0}, friction: 7, tension: 20}).start();
        }
        if (moveX > ScreenWidth/3 || vx > 2) {
          Animated.spring(this.state.mapViewPosition, { toValue: {x: ScreenWidth-20, y: 0}, friction: 7, tension: 20}).start();
        }
      }

    })
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.props.settings) != JSON.stringify(nextProps.settings)){
      this.updateMarkers(nextProps.settings);
    }
  }

  async updateMarkers( settings ){
    // console.log(settings);

    let location = await this._getLocationAsync();
    // console.log(location);

    //TODO: add relevant category + ALL category
    let url = "https://urbserver.herokuapp.com/landmark?"
    + "inLL=" + this.formatLocation(location, false)
    + "&inLimit=" + settings.nearbyLimit
    + "&inCat=" + settings.category
    + "&inRadius=" + settings.nearbyRadius;

    // console.log("here");
    // console.log(url);

    fetch(url).then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Landmark search error!');
      }
    })
    .then(responseJson => {

      let items = responseJson.landmarks;
      let markers = items.map(obj => {
        coords = {lat: obj.latitude, lng: obj.longitude}
        return {
          name: obj.name.toString(),
          location: {latitude: coords.lat, longitude: coords.lng},
          key: obj.name.toString()
        }
      })
      this.setState({
        markers: markers
      })
    })
    .catch(error => {
      // console.error(error);
    });

  }

componentDidMount() {
    LayoutAnimation.linear();
    this.setState({})

    //
    // const {status} = await Permissions.askAsync(Permissions.CAMERA);
    // this.setState({hasCameraPermission: status === 'granted'});
    //
    // this._watchHeadingAsync();
    // this._watchTargetBearingAsync();
    // let location = await this._getLocationAsync();
    // if (!markers && this.props.settings)
    // this.updateMarkers(this.props.settings);
  }


  async componentWillMount() {
    LayoutAnimation.linear();

    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});

    this._watchHeadingAsync();
    this._watchTargetBearingAsync();
    let location = await this._getLocationAsync();
    if (!this.state.markers && this.props.settings)
    this.updateMarkers(this.props.settings);
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
        this.arrowRotation = 360 - this.heading + this.targetBearing;
        if (this.arrowRotation > 360)
        this.arrowRotation -= 360;
        // console.log(this.arrowRotation);
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

  getTargetBearing = async () => {

    let startLoc = this.formatLocation(this.state.location, false);
    let destinationLoc = this.formatLocation(this.state.destination, false);
    if (!destinationLoc || !startLoc) {
      // console.log("location null. returning");
      return;
    }

    try {
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?mode=walking&origin=${ startLoc }&destination=${ destinationLoc }`);
      let respJson = await resp.json();

      if (!respJson.routes || !respJson.routes[0] || !respJson.routes[0].overview_polyline || !respJson.routes[0].overview_polyline.points) {
        // console.log(respJson);
        // console.log("respjson polylines null.returning");
        return;
      }
      respJson = respJson.routes[0].overview_polyline.points;
      let points = polyline.decode(respJson);
      if (!points || !points[1])
      return;

      let pointCoords = {latitude: points[1][0], longitude: points[1][1]};
      this.targetBearing = geolib.getRhumbLineBearing(this.formatLocation(this.state.location), pointCoords);

    } catch (error) {
      console.error(error);
    }
  };


  _watchTargetBearingAsync = async () => {
    //Periodically updates targetBearing
    this.targetBearingWatchId = setInterval(async () => {
      // console.log("targetBearingWatchId firing now")
      this.getTargetBearing();
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

    const { hasCameraPermission, location, settingVisible, mapViewPosition } = this.state


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
              <ExplorationModeSwitch
                currentScreen={navigation.state.routeName}
                changeScreen={navigation.navigate}
                dispatch={navigation.dispatch}
                />
              <ChangeModeSwitch
                replaceScreen={navigation.replace}
                currentScreen={navigation.state.routeName}
                changeScreen={navigation.navigate}
                dispatch={navigation.dispatch}
                />

              <DirectionMeter
                bearing={this.state.north}
                north={this.heading}
              />


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
                    this.setState({destination: null});
                  }}
                  initialRegion={{
                    latitude: 41.006330,
                    longitude: 28.978198,
                    latitudeDelta: 0.0039985333537870815,
                    longitudeDelta: 0.006226077675815844
                  }}
                  >

                  <MapViewDirections
                    origin={latlong}
                    destination={this.state.destination}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeWidth={3}
                    mode="walking"
                    strokeColor="hotpink"
                    />

                  {this.state.markers.map(marker => (
                    <Marker
                      key={marker.key}
                      coordinate={marker.location}
                      title={marker.name}
                      onPress={e => {
                        this.setState({
                          destination: e
                        }, this.getTargetBearing);
                      }}
                      />
                  ))}

                </MapView>

              </Animated.View>

              <TouchableOpacity
                onPress={settingVisible
                  ? this.closeSettings
                  : this.openSettings}
                  style={[styles.buttonSettings, {backgroundColor: themeColor}]}
                  >
                  <Ionicons
                    name='ios-settings-outline'
                    size={50}
                    color={white}
                    />
                </TouchableOpacity>

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
      bottom: '3%',
      width: '100%',
      height: '50%',
      zIndex: 1,
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
    buttonSettings: {
      position: 'absolute',
      zIndex: 11,
      top: 15,
      right: 15,
      height: 60,
      width: 58,
      borderRadius: 20,
      // backgroundColor: red,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 4,
    },
  })


    mapStateToProps = (state) => {
      return {
        settings: state.settings,
        themeColor: state.themeColor,
      }
    }



    export default connect(mapStateToProps)(NearbyLocations)
    // export default connect(mapStateToProps)(NearbyLocations)
