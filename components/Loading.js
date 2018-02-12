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
    city: new Animated.Value(0),
    c1: new Animated.Value(0),
    c2: new Animated.Value(0),
    c3: new Animated.Value(0),
    c4: new Animated.Value(0),
  }


  animate = () => {
    Animated.stagger(2, [
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
    ]).start()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading === true){
      this.animate()
    }
  }

  componentDidMount () {  }



  render () {

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

    if (this.props.loading){
      return (
        <View style={styles.container}>

          <Animated.View style={[styles.box, {transform: [{rotate: citySpin}]}]}>
            <Animated.Image
              source={require('../assets/urbscope_loading.png')}
              style={[styles.city, {}]}
              />
          </Animated.View>
          <Animated.View style={[styles.circle1, {transform: [{rotate: circle1Spin}]}]}/>
          <Animated.View style={[styles.circle2, {transform: [{rotate: circle2Spin}]}]}/>
          <Animated.View style={[styles.circle3, {transform: [{rotate: circle3Spin}]}]}/>
          <Animated.View style={[styles.circle4, {transform: [{rotate: circle4Spin}]}]}/>

        </View>
      )
    } else {
      return (
        <View/>
      )
    }
  }
}

export default Loading

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: ScreenWidth,
    height: ScreenHeight,
    zIndex: 4,
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
    zIndex: 5,
    width: 250,
    height: 250,
  },
  circle1: {
    position: 'absolute',
    // top: 125 - 60 ,
    // left: 125 - 60 ,
    top: ScreenHeight/2 - 60,
    left: ScreenWidth/2 - 60,
    zIndex: 5,
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
    zIndex: 5,
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
    zIndex: 5,
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
    zIndex: 5,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: '#F7931E',
    borderRadius: 30,
    width: 60,
    height: 60,
  },
})
