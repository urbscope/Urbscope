import React, { Component } from 'react'
import { View,
         Text,
         StyleSheet,
         TouchableOpacity,
         TouchableWithoutFeedback,
         Modal,
         SafeAreaView } from 'react-native'
import ChangeModeSwitch from './ChangeModeSwitch'
import { Constants, Location, Camera, Permissions } from 'expo'

import LandmarkDetailsModal from './LandmarkDetailsModal'
import vision from "react-cloud-vision-api"


vision.init({ auth: 'AIzaSyA361CU6vtQeV7TySOxc0VO_pBhIxaRt6M'})

class DetectionMode extends Component {
  state = {
    hasCameraPermission: null,
    errorMessage: null,
    location: 'Nothing Now',
    modalVisible: true,
    // image: '',
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
    console.log("take photo");

    let photo = null;
    if (this.camera) {
      photo = await this.camera.takePictureAsync({
        quality: 0.5,
        base64: true
      });
    }


    // SETTING THE IMAGE URI TO CHECK QUUALITY
    // this.setState({ image: photo.uri })


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

      if (res.responses[0].landmarkAnnotations !== undefined){
        console.log(res.responses)
        console.log(res.responses[0].landmarkAnnotations)
        console.log(res.responses[0].landmarkAnnotations[0])
        this.setState({ location : res.responses[0].landmarkAnnotations[0].description})
      } else {
        this.setState({ location : "Sorry, this landmark's not famous enough :("})
      }
      // res.responses[0].
    }, (e) => {
      console.log('Error: ', e)
    })

    console.log(req);

    console.log(photo);
  }

  // ========================================================================
  //  MODAL CONTROLS
  // ========================================================================

  closeModal = () => this.setState({ modalVisible: false })

  openModal = () => this.setState({ modalVisible: true })

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
            <TouchableWithoutFeedback onPress={this.closeModal}>
              <View style={styles.container}>

                <LandmarkDetailsModal
                  visible={this.state.modalVisible}
                  />

                <View style={styles.textBack}>
                  <Text style={styles.text}>{this.state.location}</Text>
                </View>


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
            </TouchableWithoutFeedback>
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
  }
})
