import React, {Component} from 'react'
import { Dimensions, View, Text, StyleSheet, LayoutAnimation, TouchableOpacity } from 'react-native'
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

class NearbyLocations extends Component {

    constructor(props){
        super(props);
        this.state = {
            hasCameraPermission: null,
            location: null,
            markers: [],
            destination: null,
            settingVisible: false,
        };

        this.heading = null;
        this.targetBearing = null; //Angle between current location and targetDestination
        this.arrowRotation = null;

    }


    // componentDidMount() {
    //     LayoutAnimation.linear()
    //     console.log("sync componentDidMount");
    // }

    async componentDidMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});

        this._watchHeadingAsync();
        this._watchTargetBearingAsync();
        let location = await this._getLocationAsync();

		var url = "https://urbserver.herokuapp.com/landmark?"
			+ "inLL=" + this.formatLocation(location,false)
			+ "&inQuery=" + 'food'
			+ "&inLimit=" + 3
			+ "&inOpenNow=" + 1
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


    //Will get device heading, sets as this.heading. If Navigation is taking place, ie, this.targetBearing not null:
    // set this.arrowRotation = 360 - this.heading + targetBearing;
    _watchHeadingAsync = async()=>{
        this.headingWatch = await Location.watchHeadingAsync((res)=>{
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


    formatLocation(location, asObject = true){
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

    getTargetBearing = async()=>{

        let startLoc = this.formatLocation(this.state.location, false);
        let destinationLoc = this.formatLocation(this.state.destination, false);
        if (!destinationLoc || !startLoc){
            console.log("location null. returning");
            return;
        }

        try {
            let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?mode=walking&origin=${ startLoc }&destination=${ destinationLoc }`);
            let respJson = await resp.json();

            if (!respJson.routes || !respJson.routes[0] || !respJson.routes[0].overview_polyline || !respJson.routes[0].overview_polyline.points)
            {
                console.log(respJson);
                console.log("respjson polylines null.returning");
                return;
            }
            respJson = respJson.routes[0].overview_polyline.points;
            let points = polyline.decode(respJson);
            if (!points || !points[1])
                return;

            let pointCoords= {latitude: points[1][0], longitude: points[1][1]};
            this.targetBearing = geolib.getRhumbLineBearing(this.formatLocation(this.state.location), pointCoords);

        } catch (error) {
            console.error(error);
        }
    };


    _watchTargetBearingAsync =  async()=> {
        //Periodically updates targetBearing
        this.targetBearingWatchId = setInterval(async ()=> {
            console.log("targetBearingWatchId firing now")
            this.getTargetBearing();
        }, 15000);
    };



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

              <MapView ref={ref => this.mapRef = ref} style={styles.map}
                                     provider = {MapView.PROVIDER_GOOGLE}
                                     showsUserLocation = {true}
                                     showsMyLocationButton={true}
                                     followsUserLocation={true}
                                     onPress={()=>{
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
                                            },this.getTargetBearing);
                                        }}
                                    />
                                ))}

                            </MapView>

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
