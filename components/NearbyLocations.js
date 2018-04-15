import React, {Component} from 'react'
import {Dimensions, View, Text, StyleSheet, LayoutAnimation} from 'react-native'
import ChangeModeSwitch from './ChangeModeSwitch'
import ExplorationModeSwitch from './ExplorationModeSwitch'
import {Constants, Location, Camera, Permissions, MapView} from 'expo'
import {venues} from 'react-foursquare'
import MapViewDirections from 'react-native-maps-directions';
import Marker from '../utils/CustomMarker'


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
        destination: null
    }



    componentDidMount() {
        LayoutAnimation.linear()

    }

    async componentDidMount() {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({hasCameraPermission: status === 'granted'});

        let location = await this._getLocationAsync();


        foursquare.venues.explore({
            "ll":  this.formatLocation(location,false),
            "query": 'History',
            radius: 1000,
            limit: 3
        }).then(res => {
            let items = res.response.groups[0].items;
            let markers = items.map(obj => {
                coords = obj.venue.location
                return {
                    name: obj.venue.name.toString(),
                    location: {latitude: coords.lat, longitude: coords.lng},
                    key: obj.venue.name.toString()
                }
            })
            this.setState({
                markers: markers
            })
        })
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

    componentWillUnmount() {
        console.log(this.state.markers)
    }

    render() {

        const screenWidth = Dimensions.get('window').width
        const screenHeight = Dimensions.get('window').height
        const {navigation} = this.props

        const {hasCameraPermission, location} = this.state

        let latlong = null;
        if (location != null) {
             latlong = {latitude: location.coords.latitude, longitude: location.coords.longitude};
        }
        // const latlong = {"latitude": 41.006330, "longitude": 28.978198};


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
                        </View>
                    </Camera>
                </View>
            )
        }

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
})
