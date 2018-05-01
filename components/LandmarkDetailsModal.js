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

import { purple, white, modalBackground } from '../utils/colors'

import LandmarkDetails from './LandmarkDetails'

// import LandmarkDetails from './LandmarkDetails'
// import LandmarkDetailsModal from './LandmarkDetailsModal'

const ScreenHeight = Dimensions.get('window').height
const ScreenWidth  = Dimensions.get('window').width

class LandmarkDetailsModal extends Component {

  state = {
    shouldRender: false,
    height: new Animated.Value(0),
    width: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }

  modalAppear = () => {
    const { height, width, opacity } = this.state
      // LayoutAnimation.linear();
      this.setState({shouldRender:true}, ()=>{
        // Animated.sequence([
        Animated.stagger(200, [
            Animated.timing(width, {
                toValue: 2,
                duration: 300,
            }),
            Animated.timing(height, {
                toValue: (ScreenHeight * 7)/10,
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
        ]).start()
    })
    // ])

  }

  modalDisappear = () => {
    const { height, width, opacity } = this.state

    // LayoutAnimation.linear();

    Animated.stagger(300, [
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
    ]).start(()=>this.setState({shouldRender:false}));
  }
  componentWillReceiveProps(nextProps) {

    if (nextProps.visible === true){
      this.modalAppear()
    } else {
      this.modalDisappear()
    }
  }

  componentDidMount () {
  }

    render(){
        let locations = this.props.locations
        const { height, width, opacity } = this.state

        if (locations.length === 0 ) {
            locations = [{description: 'problem'}]
        }

        // if (this.props.visible && locations.length !== 0 ) {
        if (this.props.visible ) {
            return(
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
            )
        } else {
            return (
                <View/>
            )
        }
    }
}

export default LandmarkDetailsModal

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    position: 'absolute',
    // height: '80%',
    // width: '90%',
    top: 93,
    zIndex: 1,
    // borderColor: white,
    // borderWidth: 2,
    borderRadius: 10,
    backgroundColor: modalBackground,
  },
  scroll: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
})
