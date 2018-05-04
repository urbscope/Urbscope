import React, { Component } from 'react'
import { View,
         Text,
         StyleSheet,
         TouchableOpacity,
         ScrollView,
         LayoutAnimation,
         Animated,
         Dimensions,
         Modal } from 'react-native'

// import { purple, white, modalBackground } from '../utils/colors'

import LandmarkDetails from './LandmarkDetails'

// import LandmarkDetails from './LandmarkDetails'
// import LandmarkDetailsModal from './LandmarkDetailsModal'

const ScreenHeight = Dimensions.get('window').height
const ScreenWidth  = Dimensions.get('window').width

const FONT_SIZE_SMALLER = ScreenHeight * 0.015
const FONT_SIZE_SMALL   = ScreenHeight * 0.0175
const FONT_SIZE_MEDIUM  = ScreenHeight * 0.02
const FONT_SIZE_LARGE   = ScreenHeight * 0.025
const FONT_SIZE_LARGER  = ScreenHeight * 0.027
const FONT_SIZE_LARGEST = ScreenHeight * 0.034

class LandmarkDetailsModal extends Component {

  state = {
    shouldRender: false,
    height: new Animated.Value(0),
    width: new Animated.Value(0),
    opacity: new Animated.Value(0),
    backdropOpacity: new Animated.Value(0),
    backdropZ: new Animated.Value(-10),
  }

  modalAppear = () => {
    const { height, width, opacity, backdropOpacity, backdropZ } = this.state
      // LayoutAnimation.linear();
      this.setState( {shouldRender: true}, ()=>{
        Animated.sequence([
          Animated.timing(backdropZ, {
            toValue: 1,
            duration: 1,
          }),
          Animated.stagger(200, [
              Animated.timing(width, {
                  toValue: 2,
                  duration: 300,
              }),
              Animated.timing(height, {
                  toValue: ScreenHeight * 0.78,
                  duration: 450,
              }),
              Animated.spring(width, {
                  toValue: (ScreenWidth * 9)/10,
                  friction: 4,
                  tension: 50,
              }),
              Animated.timing(opacity, {
                  toValue: 1,
                  duration: 400,
              }),
              Animated.timing(backdropOpacity, {
                toValue: 0.5,
                duration: 1000,
              }),
          ])
        ]).start()
    })
    // ])

  }

  modalDisappear = () => {
    const { height, width, opacity, backdropOpacity, backdropZ } = this.state

    // LayoutAnimation.linear();
    Animated.sequence([

      Animated.stagger(300, [
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 1000,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
        }),
        Animated.timing(width, {
          toValue: 0,
          duration: 400,
        }),
        Animated.spring(height, {
          toValue: 0,
          friction: 20,
          tension: 60,
        }),
      ]),
      Animated.timing(backdropZ, {
        toValue: -10,
        duration: 1,
      }),
    ]).start(() => this.setState( {shouldRender:false} ));

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      if (nextProps.visible === true){
        this.modalAppear()
        console.log("modal appesr");
      } else {
        this.modalDisappear()
        console.log("disappear");
      }
    }
  }

  componentDidMount () {
  }

    render(){
        let locations = this.props.locations
        const { height, width, opacity, backdropOpacity, backdropZ } = this.state

        if (locations.length === 0 ) {
            locations = [{description: 'problem'}]
        }

        // if (this.props.visible && locations.length !== 0 ) {

        // if (this.state.shouldRender ) {
            return(
              <Animated.View style={{position: 'absolute', width: '100%', height: '100%', zIndex: backdropZ, alignItems: 'center'}}>
                <Animated.View style={[styles.backdrop, {opacity: backdropOpacity, zIndex: backdropZ}]}>
                </Animated.View>

                <Animated.View style={[styles.container, {height, width}]}>
                  <Animated.ScrollView
                    ref={(scrollView) => { this.scrollView = scrollView}}
                    horizontal= {true}
                    decelerationRate={0}
                    showsHorizontalScrollIndicator={false}
                    style={[styles.scroll, {opacity}]}
                    >

                    {locations.map(item => (
                      <LandmarkDetails
                        key={item.description}
                        location={item}
                        multiple={locations.length === 1 ? false : true}
                        />
                    ))}

                    <View style={{width: 20}} />

                  </Animated.ScrollView>
                </Animated.View>

              </Animated.View>
            )
            // } else {
        //   return (
        //   <View/>
        // )
        // }
    }
}

export default LandmarkDetailsModal

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    position: 'absolute',
    // height: '80%',
    // width: '90%',
    // top: 93,
    top: (ScreenHeight * 0.08) + (ScreenHeight * 0.11)/2,
    zIndex: 2,
    // borderColor: white,
    // borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  backdrop: {
    position: 'absolute',
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
  },
  scroll: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
})
