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

import { connect } from 'react-redux'

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
    shouldRenderModalButton: false,
    hasCameraPermission: null,
    errorMessage: null,
    loading: false,
    locations: [],
    detected: false,
    modalVisible: false,
    settingVisible: false,
    modalButtonAnimations: {
      zIndex: new Animated.Value(-5),
      diameter: new Animated.Value(360),
      height: 200,
      radius: new Animated.Value(180),
      top: new Animated.Value( ScreenHeight - (ScreenHeight/2) - 200),
      opacity: new Animated.Value(0),
      fontOpacity: new Animated.Value(0),
      fontSize: new Animated.Value(1),
    }
  }

  async componentDidMount() {
    // console.log(LayoutAnimation);
    LayoutAnimation.linear();
    this.setState({})

    // this.animateModalButtonAppear()
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      this.setState({ hasCameraPermission: status === 'granted' });
  }

  // ========================================================================
  //  ASK FOR CAMERA PERMISSIONS
  // ========================================================================
  async componentWillMount() {

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
    const { diameter, radius, top, opacity, fontSize, fontOpacity, zIndex } = this.state.modalButtonAnimations
      this.setState({shouldRenderModalButton:true},()=>{
          Animated.sequence([
              Animated.timing(zIndex, {
                  toValue: 9,
                  duration: 1,
              }),
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
              ])
          ]).start();
      })

  }

  animateModalButtonDisappear = () => {
    const { diameter, radius, top, opacity, fontSize, fontOpacity, zIndex } = this.state.modalButtonAnimations

      Animated.sequence([
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
          ]),
          Animated.timing(zIndex,{
            toValue: -5,
            duration: 1
          })
    ]).start(()=>this.setState({shouldRenderModalButton:false}));
  }

  // ========================================================================
  //  RENDER METHOD
  // ========================================================================

  render(){

    const { navigation, themeColor } = this.props

    const { hasCameraPermission, locations, modalVisible, settingVisible } = this.state

    const { diameter, radius, top, opacity, fontSize, fontOpacity , zIndex} = this.state.modalButtonAnimations
    console.log("modalshouldrender is " , this.state.shouldRenderModalButton);

    if (hasCameraPermission === null) {
     return <View style={{flex:1, backgroundColor: 'black'}}/>;
    } else if (hasCameraPermission === false) {
      return (
        <View style={{flex:1, backgroundColor: 'black'}}>
          <Text>No access to camera</Text>
        </View>
      );
    } else {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Camera
            style={styles.camera}
            ref={(ref) => { this.camera = ref }}
            type={Camera.Constants.Type.back}
          >
            {/*<TouchableWithoutFeedback onPress={this.closeModal}>
            */}
              <View style={styles.container}>
                <Loading loading={this.state.loading} />
                  { (this.state.shouldRenderModalButton)
                      ? (<Animated.View

                          style={/*this.state.detected
                              ?*/ [styles.modalButton, {
                          width: diameter,
                          height: diameter,
                          zIndex,
                          borderRadius: radius,
                          top,
                          opacity,
                          backgroundColor: themeColor
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

                        </Animated.View>)
                      : <View/>}


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
                  style={[styles.buttonDetect, {backgroundColor: themeColor}]}
                >
                  <View style={styles.buttonDetectView}>
                    <MaterialIcons
                      name='camera'
                      size={50}
                      style={styles.buttonDetectIcon}
                      />
                  </View>
                </TouchableOpacity>


                <ChangeModeSwitch
                  replaceScreen={navigation.replace}
                  currentScreen={navigation.state.routeName}
                  changeScreen={navigation.navigate}
                  dispatch={navigation.dispatch}
                />


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

                {/**<TouchableOpacity
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
                </TouchableOpacity>**/}

                <Settings
                  visible={settingVisible}
                />

              </View>

            {/*</TouchableWithoutFeedback>
            */}
          </Camera>
        </SafeAreaView>
      )
    }
  }
}


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
    borderColor: '#eee',
    borderWidth: 1,
    opacity: 0.5,
  },
  buttonDetectView: {
    flex: 1,
    borderRadius: 50,
    // backgroundColor: 'rgba(183, 24, 69, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDetectIcon: {
    color: '#eee',
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
    // backgroundColor: red,
  },
  modalButtonText: {
    fontFamily: 'AppleSDGothicNeo-Thin',
    // fontSize: 40,
    marginTop: 5,
    color: white
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

export default connect(mapStateToProps)(DetectionMode)
