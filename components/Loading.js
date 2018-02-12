import React from 'react'
import { View,
         Text,
         StyleSheet,
         TouchableOpacity,
         ScrollView,
         LayoutAnimation,
         Animated,
         Easing,
         Dimensions,
         Image } from 'react-native'


// Get Screen Dimensions
const ScreenHeight = Dimensions.get('window').height
const ScreenWidth  = Dimensions.get('window').width

class Loading extends React.Component {

  state = {
    opacity: new Animated.Value(0),
    opacityCircle: new Animated.Value(0),
    city: new Animated.Value(0),
    c1: new Animated.Value(0),
    c2: new Animated.Value(0),
    c3: new Animated.Value(0),
    c4: new Animated.Value(0),
    zIndex: new Animated.Value(-2),
  }



  animateStart = () => {

    Animated.stagger(300, [
      Animated.sequence([
        Animated.timing( this.state.zIndex,{
          toValue: 5,
          duration: 1,
        }),
        Animated.timing( this.state.opacity ,{
          toValue: 1,
          duration: 500,
        }),
      ]),
      Animated.parallel([
        Animated.timing( this.state.opacityCircle ,{
          toValue: 1,
          duration: 500,
        }),
        Animated.loop(
          Animated.timing( this.state.city, {
            toValue: 1,
            duration: 7000,
            easing: Easing.linear
          })
        ),
        Animated.loop(
          Animated.timing( this.state.c1, {
            toValue: 1,
            duration: 7000,
            easing: Easing.linear
          })
        ),
        Animated.loop(
          Animated.timing( this.state.c2, {
            toValue: 1,
            duration: 4200,
            easing: Easing.linear
          })
        ),
        Animated.loop(
          Animated.timing( this.state.c3, {
            toValue: 1,
            duration: 3300,
            easing: Easing.linear
          })
        ),
        Animated.loop(
          Animated.timing( this.state.c4, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear
          })
        ),
      ])
    ]).start()
  }
  animateEnd = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing( this.state.opacity, {
          toValue: 0,
          duration: 500,
        }),
        Animated.timing( this.state.opacityCircle, {
          toValue: 0,
          duration: 500,
        }),
      ]),
      Animated.timing( this.state.zIndex,{
        toValue: -5,
        duration: 1,
      }),
    ]).start()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading === true){
      this.animateStart()
    } else {
      this.animateEnd()
    }
  }

  componentDidMount () {  }



  render () {

    const { opacity, opacityCircle, zIndex } = this.state

    const citySpin = this.state.city.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    const circle1Spin = this.state.c1.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    const circle2Spin = this.state.c2.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-360deg']
    })
    const circle3Spin = this.state.c3.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    const circle4Spin = this.state.c4.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-360deg']
    })

    return (

      <Animated.View style={[styles.container, {opacity, zIndex}]}>

        <Animated.View style={[styles.box, {transform: [{rotate: citySpin}], opacity: opacityCircle, zIndex}]}>
          <Animated.Image
            source={require('../assets/urbscope_loading.png')}
            style={[styles.city, {}]}
            />
        </Animated.View>
        <Animated.View style={[styles.circle1, {transform: [{rotate: circle1Spin}], opacity: opacityCircle, zIndex}]}/>
        <Animated.View style={[styles.circle2, {transform: [{rotate: circle2Spin}], opacity: opacityCircle, zIndex}]}/>
        <Animated.View style={[styles.circle3, {transform: [{rotate: circle3Spin}], opacity: opacityCircle, zIndex}]}/>
        <Animated.View style={[styles.circle4, {transform: [{rotate: circle4Spin}], opacity: opacityCircle, zIndex}]}/>

      </Animated.View>
    )

  }
}

export default Loading

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: ScreenWidth,
    height: ScreenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  box: {
    position: 'absolute',
    flexWrap: 'wrap',
    top: ScreenHeight/2 - 125,
    left: ScreenWidth/2 - 125,
    height: 250,
    width: 250,
    // borderRadius: 1,
    // borderColor: '#fff',
    // borderWidth: 1,
    // backgroundColor: 'white',

  },
  city: {
    // position: 'absolute',
    // position: 'absolute',
    top: -3.5 ,
    left: 2 ,
    // top: ScreenHeight/2 - 129,
    // left: ScreenWidth/2 - 123,
    width: 250,
    height: 250,
  },
  circle1: {
    position: 'absolute',
    // top: 125 - 60 ,
    // left: 125 - 60 ,
    top: ScreenHeight/2 - 60,
    left: ScreenWidth/2 - 60,
    borderWidth: 3,
    borderColor: '#FF1D25',
    borderRadius: 60,
    borderStyle: 'dashed',
    width: 120,
    height: 120,
  },
  circle2: {
    position: 'absolute',
    // top: 125 - 50 ,
    // left: 125 - 50 ,
    top: ScreenHeight/2 - 50,
    left: ScreenWidth/2 - 50,
    borderWidth: 3,
    borderColor: '#7AC943',
    borderStyle: 'dashed',
    borderRadius: 50,
    width: 100,
    height: 100,
  },
  circle3: {
    position: 'absolute',
    // top: 125 - 40 ,
    // left: 125 - 40 ,
    top: ScreenHeight/2 - 40,
    left: ScreenWidth/2 - 40,
    borderWidth: 3,
    borderColor: '#3FA9F5',
    borderRadius: 40,
    borderStyle: 'dashed',
    width: 80,
    height: 80,
  },
  circle4: {
    position: 'absolute',
    // top: 125 - 30 ,
    // left: 125 - 30 ,
    top: ScreenHeight/2 - 30,
    left: ScreenWidth/2 - 30,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#F7931E',
    borderRadius: 30,
    width: 60,
    height: 60,
  },
})
