import React, { Component } from 'react'
import { View,
         Text,
         StyleSheet,
         TouchableOpacity,
         TouchableHighlight,
         TouchableWithoutFeedback,
         Alert,
         Animated,
         LayoutAnimation,
         Dimensions,
         ActivityIndicator,
         SafeAreaView } from 'react-native'
import { Constants, Location, Camera, Permissions } from 'expo'
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

import vision from "react-cloud-vision-api"

import ChangeModeSwitch from './ChangeModeSwitch'
import LandmarkDetailsModal from './LandmarkDetailsModal'
import Loading from './Loading'
import Settings from './Settings'

import { purple, white, red } from '../utils/colors'
import { fixDetectedLandmarks, fixLandmarkDetails } from '../utils/helpers'
import { GOOGLE_API } from '../utils/keysAPI'

// Initalize the CloudVision API
vision.init({ auth: GOOGLE_API })

// Get Screen Dimensions
const ScreenHeight = Dimensions.get('window').height
const ScreenWidth  = Dimensions.get('window').width


// ===========================================================================
//  BEGINNING OF THE CLASS
// ===========================================================================
class DetectionMode extends Component {
  state = {
    hasCameraPermission: null,
    errorMessage: null,
    loading: false,
    locations: [],
    detected: false,
    modalVisible: false,
    settingVisible: false,
    modalButtonAnimations: {
      diameter: new Animated.Value(360),
      height: 200,
      radius: new Animated.Value(180),
      top: new Animated.Value( ScreenHeight - (ScreenHeight/2) - 200),
      opacity: new Animated.Value(0),
      fontOpacity: new Animated.Value(0),
      fontSize: new Animated.Value(1),
    }
  }

  componentDidMount() {
    // console.log(LayoutAnimation);
    LayoutAnimation.linear();
    this.setState({})
    // this.animateModalButtonAppear()
  }

  // ========================================================================
  //  ASK FOR CAMERA PERMISSIONS
  // ========================================================================
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  // ========================================================================
  // Detect Landmark using Google's Cloud Vision api
  // ========================================================================
  detectLandmark = async () => {

    this.animateModalButtonDisappear()

    this.setState({
      loading: true,
      detected: false,
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

      if (fixedRes !== null ) {

        this.setState({
          locations: fixedRes,
          loading: false,
          detected: true,
        })
        this.animateModalButtonAppear()

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
  }

  // ========================================================================
  //  MODAL CONTROLS
  // ========================================================================
  closeModal = () => {
    this.setState({ modalVisible: false })
  }

  openModal = () => {
    if (this.state.detected){
      this.setState({ modalVisible: true })
    }
  }

  closeSettings = () => {
    this.setState({ settingVisible: false })
  }


  openSettings = () => {
    this.setState({ settingVisible: true })
  }


  // ========================================================================
  //  ANIMATIONS FOR BUTTON
  // ========================================================================

  animateModalButtonAppear = () => {
    const { diameter, radius, top, opacity, fontSize, fontOpacity } = this.state.modalButtonAnimations

    Animated.stagger(200, [
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
        }),
        Animated.timing(diameter, {
          toValue: 86,
          duration: 600,
        }),
        Animated.timing(radius, {
          toValue: 43,
          duration: 600,
        }),
        Animated.timing(fontSize, {
          toValue: 40,
          duration: 600,
        }),
      ]),
      Animated.spring(top, {
        toValue: (50),
        friction: 4,
        tension: 50,
      }),
      Animated.sequence([
        Animated.timing(fontOpacity, {
          toValue: 1,
          duration: 600,
        }),
        Animated.timing(fontSize, {
          toValue: 80,
          duration: 800,
        }),
        Animated.timing(fontSize, {
          toValue: 40,
          duration: 400,
        }),
      ])
    ]).start();

  }

  animateModalButtonDisappear = () => {
    const { diameter, radius, top, opacity, fontSize, fontOpacity } = this.state.modalButtonAnimations

    Animated.stagger(500, [
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
        }),
        Animated.timing(diameter, {
          toValue: 0,
          duration: 500,
        }),
        Animated.timing(radius, {
          toValue: 0,
          duration: 500,
        }),
        Animated.timing(fontSize, {
          toValue: 0,
          duration: 500,
        }),
        Animated.timing(fontOpacity, {
          toValue: 0,
          duration: 500,
        }),
      ]),
      Animated.parallel([
        Animated.timing(diameter, {
          toValue: 360,
          duration: 1,
        }),
        Animated.timing(radius, {
          toValue: 180,
          duration: 1,
        }),
        Animated.timing(top, {
          toValue: ScreenHeight - (ScreenHeight/2) - 200,
          duration: 1,
        }),
      ])
    ]).start();
  }

  // ========================================================================
  //  RENDER METHOD
  // ========================================================================

  render(){

    const { navigation } = this.props

    const { hasCameraPermission, locations, modalVisible, settingVisible } = this.state

    const { diameter, radius, top, opacity, fontSize, fontOpacity } = this.state.modalButtonAnimations

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
                <Loading loading={this.state.loading} />

                <Animated.View

                  style={/*this.state.detected
                          ?*/ [styles.modalButton, {
                              width: diameter,
                              height: diameter,
                              borderRadius: radius,
                              top,
                              opacity,
                            }]
                          /*: {}*/}
                >
                  <TouchableOpacity
                    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                    onPress={this.state.modalVisible ? this.closeModal : this.openModal}
                  >
                    <Animated.Text style={[styles.modalButtonText, { fontSize, opacity: fontOpacity }]}>
                      {locations.length}
                    </Animated.Text>
                  </TouchableOpacity>

                </Animated.View>

                <LandmarkDetailsModal
                  visible={modalVisible}
                  locations={this.state.locations}
                />

                {/*
                  <View style={styles.textBack}>
                    <Text style={styles.text}>{this.state.location}</Text>
                  </View>
                */}


                <TouchableOpacity
                  onPress={modalVisible
                            ? () => {}
                            : this.detectLandmark}
                  style={styles.buttonDetect}
                >
                  <View style={styles.buttonDetectView}>
                    <Ionicons
                      name='ios-compass-outline'
                      size={80}
                      style={styles.buttonDetectIcon}
                      />
                  </View>
                </TouchableOpacity>


                <ChangeModeSwitch
                  currentScreen={navigation.state.routeName}
                  changeScreen={navigation.navigate}
                  dispatch={navigation.dispatch}
                  />


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

                {

                }
                <Settings
                  visible={settingVisible}
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
  buttonDetect: {
    position: 'absolute',
    bottom: ScreenHeight/16,
    left: ScreenWidth/2 - 50,
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: red,
    borderWidth: 3,
  },
  buttonDetectView: {
    flex: 1,
    borderRadius: 50,
    backgroundColor: 'rgba(183, 24, 69, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDetectIcon: {
    color: red,
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
    borderWidth: 1,
    borderColor: white,
    // top: this.state.modalButtonAnimations.top,
    zIndex: 9,
    backgroundColor: red,
  },
  modalButtonText: {
    fontFamily: 'AppleSDGothicNeo-Thin',
    // fontSize: 40,
    marginTop: 5,
    color: white
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
  buttonSettingsIcon: {
    color: red,
  }
})
