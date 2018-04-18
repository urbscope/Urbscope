import React, { Component } from 'react'
import { Dimensions, View, Text, StyleSheet } from 'react-native'
import * as THREE from 'three'
import ExpoTHREE from 'expo-three'
import Expo from 'expo'

const ScreenHeight = Dimensions.get('window').height
const ScreenWidth  = Dimensions.get('window').width

class DirectionMeter extends Component {


  _onGLContextCreate = async (gl) => {


    console.log(gl);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );


    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    const texture = await ExpoTHREE.loadAsync(
      require('../assets/icon.png')
    );

    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // const material = new THREE.MeshBasicMaterial({ map: texture });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 2;

    const animate = () => {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.02;
      // cube.rotation.y += 0.04;

      renderer.render(scene, camera);

      gl.endFrameEXP();
    }
    animate();
  }

  render () {

    return(
      <View style={styles.container}>
        <Expo.GLView
          style={styles.gl}

          onContextCreate={this._onGLContextCreate}
       />

      </View>
    )
  }
}

export default DirectionMeter

const styles = StyleSheet.create({
    container: {
      top: ScreenHeight*0.1,
      left: 0,
      width: 100 + ScreenHeight*0.05,
      height: 100 + ScreenHeight*0.05,
      alignItems: 'stretch',
      borderWidth: 1,
      borderColor: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      zIndex: 2,
    },
    gl: {
      flex: 1,
      backgroundColor: 'rgba(200, 0, 200, 0.2)',
    },
    text: {
      flex: 0.05,
      color: '#fff',
    }
})
