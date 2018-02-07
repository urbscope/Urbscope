import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import ChangeModeSwitch from './ChangeModeSwitch'
import ExplorationModeSwitch from './ExplorationModeSwitch'
import { Camera, Permissions } from 'expo'

class Recommendations extends Component {
  state = {
    hasCameraPermission: null,
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render(){
    const { navigation } = this.props

    const { hasCameraPermission } = this.state

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={styles.camera} type={Camera.Constants.Type.back}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
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
           </View>
         </Camera>
       </View>
     )
    }

  }
}

export default Recommendations


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  camera: {
    flex: 1
  }
})
