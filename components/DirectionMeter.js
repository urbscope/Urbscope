import React, { Component } from 'react'
import { Dimensions,
         View,
         Text,
         Animated,
         StyleSheet } from 'react-native'
import * as THREE from 'three'
import ExpoTHREE from 'expo-three'
import Expo from 'expo'

import { connect } from 'react-redux';

const ScreenHeight = Dimensions.get('window').height
const ScreenWidth  = Dimensions.get('window').width

class DirectionMeter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      verticalPosition: new Animated.Value(-ScreenHeight*0.2),
        shouldRender : false,
    }

    this.hasColorChanged = false
      this.lastBearing = null;
      this.shouldGoAway = false;
  }


  modalAppear = () => {
    const { verticalPosition } = this.state
      this.setState({shouldRender:true}, ()=>{
          Animated.spring(verticalPosition, {
              toValue: ScreenHeight * 0.02,
              friction: 4,
              tension: 6,
          }).start();
      });
  }

  modalDisappear = () => {
    const { verticalPosition } = this.state

    Animated.spring(verticalPosition, {
      toValue: - ScreenHeight * 0.3,
      friction: 4,
      tension: 6,
    }).start(()=>this.setState({shouldRender: false}));

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible) {
      // setTimeout(() => {
        this.shouldGoAway = false;
        this.modalAppear()
      // }, 1000)
    } else {
      // setTimeout(() => {
        this.lastBearing = this.props.bearing;
        this.shouldGoAway = true;
        this.modalDisappear()
      // }, 1000)
    }

    if (nextProps.themeColor !== this.props.themeColor) {
      this.hasColorChanged = true
    } else {
      this.hasColorChanged = false
    }
  }

  _onGLContextCreate = async (gl) => {

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );

    const renderer = ExpoTHREE.createRenderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    scene.add( new THREE.AmbientLight( 0xeeeeee ) );

		var light = new THREE.PointLight( 0xeeeeee );
    light.position.z = 80;
		light.position.y = 30;
		scene.add( light );

    var length = 2, width = 1;

    var shape = new THREE.Shape();
    shape.moveTo( -10, -38 );
    shape.lineTo( -10,  0 );
    shape.quadraticCurveTo( -10, 15, -26, 2)
    shape.quadraticCurveTo( -30, -1, -27, 3)
    // shape.lineTo( -30,  0 );

    //TOP POINT
    shape.lineTo(  -3,  37 );
    shape.quadraticCurveTo( 0, 40, 3, 37)
    shape.lineTo(  27,  3 );

    shape.quadraticCurveTo( 30, -1, 26, 2)

    shape.quadraticCurveTo( 10, 15, 10, 0)

    shape.lineTo(  10, -38 );
    shape.quadraticCurveTo( 10, -40, 9, -39)
    shape.quadraticCurveTo( 0, -30, -9, -39)
    shape.quadraticCurveTo( -10, -40, -10, -38)


    var extrudeSettings = {
      curveSegments: 20,
    	steps: 10,
    	amount: 15,
    	bevelEnabled: true,
    	bevelThickness: 0.1,
    	bevelSize: 0.1,
    	bevelSegments: 20
    };

    var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

    const texture = await ExpoTHREE.loadAsync(
      require('../assets/wood.jpg')
    );

    var material = new THREE.MeshStandardMaterial( {color: this.props.themeColor} );
    // var material = new THREE.MeshBasicMaterial({ map: texture });

    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // console.log(cube);

    cube.rotation.x = - 0.28 * Math.PI;


    camera.position.z = 80;


    const animate = () => {
      requestAnimationFrame(animate);


      if (this.hasColorChanged) {
        cube.material = new THREE.MeshStandardMaterial( {color: this.props.themeColor} )
        this.hasColorChanged = false
      }

      if (this.shouldGoAway){
          cube.rotation.z = -this.lastBearing * Math.PI / 180;
      }
      else {
          cube.rotation.z = -this.props.bearing * Math.PI / 180;
      }
      renderer.render(scene, camera);

      gl.endFrameEXP();
    }
    animate();


  }

  render () {
    const { verticalPosition } = this.state

    if (this.state.shouldRender) {

      return(
        <Animated.View style={[styles.container, {top: verticalPosition}]}>

          <Expo.GLView
            style={styles.gl}
            onContextCreate={this._onGLContextCreate}
            />

        </Animated.View>
      )
    } else {
      return(
        <View>
        </View>
      )
    }
  }
}



const styles = StyleSheet.create({
    container: {
      // top: ScreenHeight*0.02,
      // left: ScreenHeight*0.1,

      left: ScreenWidth*0.25,
      width: ScreenWidth*0.5,
      height: ScreenWidth*0.5,
      alignItems: 'stretch',
      // borderWidth: 1,
      borderColor: '#fff',
      // backgroundColor: 'rgba(255, 255, 255, 0.1)',
      zIndex: 2,
    },
    gl: {
      flex: 1,
      opacity: 1,
      // backgroundColor: 'rgba(200, 0, 200, 0.2)',
    },
    text: {
      flex: 0.05,
      color: '#fff',
    }
})

mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}

export default connect(mapStateToProps)(DirectionMeter)
