import React, { Component } from 'react'
import { View,
         Text,
         StyleSheet,
         TouchableOpacity,
         TouchableWithoutFeedback,
         Alert,
         Animated,
         LayoutAnimation,
         Dimensions,
         ActivityIndicator,
         SafeAreaView } from 'react-native'
import { Constants, Location, Camera, Permissions } from 'expo'

import vision from "react-cloud-vision-api"

import ChangeModeSwitch from './ChangeModeSwitch'
import LandmarkDetailsModal from './LandmarkDetailsModal'

import { purple, white } from '../utils/colors'
import { fixDetectedLandmarks, fixLandmarkDetails } from '../utils/helpers'

import { CLOUD_VISION_API_KEY } from '../utils/CloudVisionAPI'
import { FS_CLIENT_ID, FS_CLIENT_PW } from '../utils/FoursquareAPI'

// Initalize the FourSquare API
var foursquare = require('react-foursquare')({
  clientID: 'EECH5IF2TSK01WV2DQUKIRNT5CUVRTH0AVVDFM521E32ZVPH',
  clientSecret: '1LL20JSTUVM1BM4G30E0KMN1QBKU3ZDVLMO1OP5QIPWCQEOK'
})

// Initalize the CloudVision API
vision.init({ auth: CLOUD_VISION_API_KEY })

const ScreenWidth = Dimensions.get('window')


// ===========================================================================
//  BEGINNING OF THE CLASS
// ===========================================================================
class DetectionMode extends Component {
  state = {
    hasCameraPermission: null,
    errorMessage: null,
    loading: false,
    locations: [],
    locationDetails: null,
    detected: true,
    modalVisible: false,
    modalButtonAnimations: {
      diameter: new Animated.Value(200),
      height: 200,
      radius: new Animated.Value(100),
      top: '30%',
      opacity: 1,
    }
  }

  // ========================================================================
  //  ASK FOR CAMERA PERMISSIONS
  // ========================================================================
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  //




  // ========================================================================
  // Detect Landmark using Google's Cloud Vision api
  // ========================================================================
  detectLandmark = async () => {
    console.log("take photo");
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    // this.setState({
    //   modalButtonAnimations: {
    //     diameter: 2,
    //     radius: 1,
    //     top: '6%',
    //     opacity: 0,
    //   },
    // })

    this.setState({
      loading: true,
      detected: false,
      // modalButtonAnimations: {
      //   diameter: 200,
      //   radius: 100,
      //   top: '30%',
      // },
    })

    let photo = null;
    if (this.camera) {
      photo = await this.camera.takePictureAsync({
        quality: 0.5,
        base64: true
      });
    }

    const req = new vision.Request({
      image: new vision.Image({
        base64: photo.base64,
      }),
      features: [
        new vision.Feature('LANDMARK_DETECTION', 5),
      ]
    })

    vision.annotate(req).then((res) => {

      // handling response
      let fixedRes = fixDetectedLandmarks(res)
      // console.log(this.state);
      // console.log(fixedRes);
      if (fixedRes !== null ) {


        // this.setState({ location : fixedRes[0].description })

        // var locations = []
        // this.setState((prevState) => ({
        //   locations: prevState.locations.push(location)
        // }))

        this.setState({
          locations: fixedRes,
          loading: false,
          detected: true,
        })

        // var CustomLayoutSpring = {
        //   duration: 1000,
        //   create: {
        //     type: LayoutAnimation.Types.linear,
        //     property: LayoutAnimation.Properties.opacity,
        //   },
        //   update: {
        //     type: LayoutAnimation.Types.curveEaseInEaseOut,
        //   },
        // };
        //
        // LayoutAnimation.configureNext(CustomLayoutSpring);
        // this.setState({
        //   modalButtonAnimations: {
        //     diameter: 74,
        //     radius: 37,
        //     top: '5%',
        //   },
        // })

        // fixedRes.forEach( location => {
        //   console.log(location);
        //   foursquare.venues.getVenues({
        //     ll: ''+location.latitude+','+location.longitude,
        //     query: location.description,
        //     radius: 100,
        //     limit: 1
        //   }).then(res => {
        //     let fixedDetail = fixLandmarkDetails(res)
        //
        //     if (fixedDetail ) {
        //       this.setState((prevState) => ({
        //         locations: prevState.locations.push(fixedDetail),
        //       }))
        //       console.log("This is the name of the object added");
        //       console.log(" ");
        //       console.log(fixedDetail.name)
        //       console.log(" ");
        //     } else {
        //       console.log("Location not Found")
        //     }
        //
        //   })
        // })

        // for (const location of fixedRes){
        //   await getLocationDetails(location)
        // }
        // this.getLocationDetails(fixedRes)


        // this.setState({
        //   loading: false,
        //   detected: true,
        //   modalVisible: true,
        // })

        // this.setState({ locations })
        // console.log("NEW STATEE");
        // console.log(this.state);

      } else {
        Alert.alert("Sorry. This particular landmark couldn't be detected.")
        this.setState({
          location : [],
          loading: false,
        })
      }
    }, (e) => {
      console.log('Error: ', e)
    })




  // foursquare.venues.getVenues({
  //   ll: '51.500782,-0.12462600000000001',
  //   query: 'house of parliament',
  //   radius: 100,
  //   limit: 1
  // }).then(res => {
  //   let fixedDetail = fixLandmarkDetails(res)
  //
  //   if (fixedDetail !== null ) {
  //     // locations.push(location)
  //     console.log(fixedDetail)
  //   } else {
  //     console.log("Location not Found")
  //   }
  // })
    // console.log(photo);
  }

  // ========================================================================
  //  GET DETAILS FOR LANDMARKS
  // ========================================================================

  // getLocationDetails = async (data) => {
  //   for (const location of data){
  //     console.log(location);
  //     await foursquare.venues.getVenues({
  //       ll: ''+location.latitude+','+location.longitude,
  //       query: 'Houses of parliament',
  //       radius: 100,
  //       limit: 1
  //     }).then(async (res) => {
  //       let fixedDetail = fixLandmarkDetails(res)
  //
  //       if (fixedDetail ) {
  //         this.setState((prevState) => ({
  //           locations: prevState.locations.push(fixedDetail),
  //         }))
  //         console.log("This is the name of the object added");
  //         console.log(" ");
  //         console.log(fixedDetail.name)
  //         console.log(" ");
  //       } else {
  //         console.log("Location not Found")
  //       }
  //     })
  //   }
  //   console.log("done");
  //   this.setState({
  //     loading: false,
  //     detected: true,
  //     modalVisible: true,
  //   })
  // }




  // ========================================================================
  //  MODAL CONTROLS
  // ========================================================================

  closeModal = () => {
    // LayoutAnimation.spring();
    this.setState({ modalVisible: false })
  }

  openModal = () => {
    // var CustomLayoutSpring = {
    //   duration: 400,
    //   create: {
    //     type: LayoutAnimation.Types.easeIneaseOut,
    //     property: LayoutAnimation.Properties.scaleXY,
    //     springDamping: 0.7,
    //   },
    //   update: {
    //     type: LayoutAnimation.Types.easeIneaseOut,
    //     springDamping: 0.7,
    //   },
    // };
    // LayoutAnimation.configureNext(CustomLayoutSpring);
    this.setState({ modalVisible: true })
  }

  componentDidMount() {
    // console.log(LayoutAnimation);
    // LayoutAnimation.linear();
    this.setState({})

    this.animateModalButtonAppear()

  }

  animateModalButtonAppear = () => {
    const { diameter, radius, top } = this.state.modalButtonAnimations

    // Animated.timing(                  // Animate over time
    //   this.state.fadeAnim,            // The animated value to drive
    //   {
    //     toValue: 1,                   // Animate to opacity: 1 (opaque)
    //     duration: 10000,              // Make it take a while
    //   }
    // ).start();
    Animated.parallel([
      // after decay, in parallel:
      // Animated.spring(top, {
      //   toValue: '10%',
      //   duration: 2000,
      //    // return to start
      // }),
      Animated.timing(diameter, {
        // and twirl
        toValue: 74,
        duration: 2000,
      }),
      Animated.timing(radius, {
        // and twirl
        toValue: 37,
        duration: 2000,
      }),
    ]).start();


    // Animated.sequence([
    //   // decay, then spring to start and twirl
    //   Animated.decay(position, {
    //     // coast to a stop
    //     velocity: {x: gestureState.vx, y: gestureState.vy}, // velocity from gesture release
    //     deceleration: 0.997,
    //   }),
    //   Animated.parallel([
    //     // after decay, in parallel:
    //     Animated.spring(position, {
    //       toValue: {x: 0, y: 0}, // return to start
    //     }),
    //     Animated.timing(twirl, {
    //       // and twirl
    //       toValue: 360,
    //     }),
    //   ]),
    // ]).start(); // start the sequence group
  }

  render(){
    const { navigation } = this.props

    const { hasCameraPermission } = this.state


    // if (this.state.image !== '') {
    //   console.log("goes into IMage View");
    //   return(
    //     <View style={{ flex: 1 }}>
    //       <Image
    //         style={{flex: 1}}
    //         source={{uri: this.state.image}}
    //         />
    //     </View>
    //   )
    // }


    if (hasCameraPermission === null) {
     return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={styles.camera}
            ref={(ref) => { this.camera = ref }}
            type={Camera.Constants.Type.back}
          >
            {/*<TouchableWithoutFeedback onPress={this.closeModal}>
            */}
              <View style={styles.container}>
                <ActivityIndicator
                  size="large"
                  color={white}
                  animating={this.state.loading}
                />

              <Animated.View

                style={this.state.detected
                        ? [styles.modalButton, {
                            width: this.state.modalButtonAnimations.diameter,
                            height: this.state.modalButtonAnimations.diameter,
                            borderRadius: this.state.modalButtonAnimations.radius,
                            top: this.state.modalButtonAnimations.top,
                            opacity: this.state.modalButtonAnimations.opacity,
                          }]
                        : {}}
              >
                  <TouchableOpacity
                    style={{flex: 1}}
                    onPress={this.state.modalVisible ? this.closeModal : this.openModal}
                    >
                  </TouchableOpacity>

                </Animated.View>

                <LandmarkDetailsModal
                  visible={this.state.modalVisible}
                  locations={this.state.locations}
                />

                {/*
                  <View style={styles.textBack}>
                    <Text style={styles.text}>{this.state.location}</Text>
                  </View>
                */}


                <TouchableOpacity onPress={this.detectLandmark}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Get Information</Text>
                  </View>
                </TouchableOpacity>

                <ChangeModeSwitch
                  currentScreen={navigation.state.routeName}
                  changeScreen={navigation.navigate}
                  dispatch={navigation.dispatch}
                  />

              </View>

            {/*</TouchableWithoutFeedback>
            */}
          </Camera>
        </View>
      )
    }
  }
}

export default DetectionMode

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  camera: {
    flex: 1
  },
  button: {
    flex: 0.06,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 2,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  buttonText: {
    fontSize: 20,
  },
  textBack: {
    position: 'absolute',
    width: '80%',
    height: 50,
    top: '20%',
    left: '10%',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    borderColor: '#fff',
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 2,
  },
  text: {
    fontSize: 20,
  },
  modalView: {
    flex: 0.5,
  },
  modalButton: {
    position: 'absolute',
    // height: this.state.modalButtonAnimations.height,
    // width: this.state.modalButtonAnimations.height,
    // borderRadius: this.state.modalButtonAnimations.radius,
    borderWidth: 2,
    borderColor: white,
    // top: this.state.modalButtonAnimations.top,
    zIndex: 2,
    backgroundColor: purple,
  }
})
