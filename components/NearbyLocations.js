import React, {Component} from 'react'
import { Dimensions, View, Text, StyleSheet, LayoutAnimation, TouchableOpacity } from 'react-native'
import ChangeModeSwitch from './ChangeModeSwitch'
import ExplorationModeSwitch from './ExplorationModeSwitch'
import { Constants, Location, Camera, Permissions, MapView } from 'expo'
import { venues } from 'react-foursquare'
import MapViewDirections from 'react-native-maps-directions';

import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

import { connect } from 'react-redux'

import Marker from './CustomMarker'
import DirectionMeter from './DirectionMeter'
import Settings from './Settings'

import { purple, white, red } from '../utils/colors'

var foursquare = require('react-foursquare')({
    clientID: 'EECH5IF2TSK01WV2DQUKIRNT5CUVRTH0AVVDFM521E32ZVPH',
    clientSecret: '1LL20JSTUVM1BM4G30E0KMN1QBKU3ZDVLMO1OP5QIPWCQEOK'
})

let GOOGLE_MAPS_APIKEY = "AIzaSyCOFvXSiK0tMiDIXbWpUaj5s89lMh55Ov4";

class NearbyLocations extends Component {
  state = {
      hasCameraPermission: null,
      location: null,
      markers: [],
      destination: null,
      settingVisible: false,
  }



  componentDidMount() {
    LayoutAnimation.linear()

  }

  async componentDidMount() {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});

    let location = await this._getLocationAsync();

  	var url = "https://urbserver.herokuapp.com/landmark?"
  		+ "inLL=" + this.formatLocation(location,false)
  		+ "&inQuery=" + 'food'
  		+ "&inLimit=" + 3
  		+ "&inOpenNow=" + 0
  		+ "&inRadius=" + 5000
  	console.log( url);

  	fetch(url).then(response => {
  		if (response.status === 200) {
  			return response.json();
  		} else {
  			throw new Error('Landmark search error!');
  		}
  	})
  	.then( responseJson => {

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
  	.catch( error => {
  	  console.error(error);
  	});

  }

  _getLocationAsync = async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
          this.setState({
              errorMessage: 'Permission to access location was denied',
          });
      }

      let location = await Location.getCurrentPositionAsync({});
      this.setState({ location });
      return location;
  };

  formatLocation(location, asObject){
      if (!location)
          return null;
      if (asObject)
          return  {latitude: location.coords.latitude, longitude: location.coords.longitude};
      else
          return "" + location.coords.latitude + "," + location.coords.longitude;
  }



  closeSettings = () => {
    this.setState({ settingVisible: false })
  }


  openSettings = () => {
    this.setState({ settingVisible: true })
  }

  render() {

    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height
    const { navigation } = this.props

    const { hasCameraPermission, location, settingVisible } = this.state

    let latlong = null;
    if (location != null) {
         latlong = {latitude: location.coords.latitude, longitude: location.coords.longitude};
    }

    if ((hasCameraPermission === null) && (location === null)) {
        return <View/>;
    } else if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    } else if ((location === null)) {
        return (
            <View>
                <Text> Wait for location</Text>
            </View>
        )
    } else {
      return (
        <View style={{flex: 1}}>
          <Camera style={styles.camera} type={Camera.Constants.Type.back}>
            <View
              style={styles.container}>
              <ExplorationModeSwitch
                  currentScreen={navigation.state.routeName}
                  changeScreen={navigation.navigate}
                  dispatch={navigation.dispatch}
              />
              <ChangeModeSwitch
                  currentScreen={navigation.state.routeName}
                  changeScreen={navigation.navigate}
                  dispatch={navigation.dispatch}
              />

              <DirectionMeter />
{/*
              <MapView ref={ref => this.mapRef = ref} style={styles.map}
                       provider = {MapView.PROVIDER_GOOGLE}
                       showsUserLocation = {true}
                       showsMyLocationButton={true}
                       followsUserLocation={true}
                       onPress={()=>this.setState({destination: null})}
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
                  mode = "walking"
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
                              });
                          }}
                      />
                  ))}

              </MapView>

*/}


              <TouchableOpacity
                onPress={settingVisible
                          ? this.closeSettings
                          : this.openSettings}
                  style={styles.buttonSettings}
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
        </View>
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

    map: {
        position: 'absolute',
        borderRadius: 25,
        borderWidth: 3,
        borderColor: 'black',
        left: '3%',
        right: '3%',
        bottom: '1%',
        width: '94%',
        height: 300
    },
    buttonSettings: {
      position: 'absolute',
      zIndex: 11,
      top: 15,
      right: 15,
      height: 60,
      width: 58,
      borderRadius: 20,
      backgroundColor: red,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 4,
    },
})


mapStateToProps = (state) => {
  return {
    settings: state
  }
}


export default connect(mapStateToProps)(NearbyLocations)
