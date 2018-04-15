import React from 'react'
import { View,
         StyleSheet,
         Text,
         ScrollView,
         Slider,
         Animated,
         PickerIOS,
         Dimensions } from 'react-native'

import { red, white, teal, cream, yellow, lightRed, darkRed } from '../utils/colors'

var ScreenWidth = Dimensions.get('window').width
var ScreenHeight = Dimensions.get('window').height

class Settings extends React.Component {

  state = {
    dectionLimit: 5,
    nearbyLimit: 10,
    nearbyRadius: 1000,
    category: 'religious',
    animation: {
      containerHeight: new Animated.Value(60),
      containerWidth: new Animated.Value(58),
      opacity: new Animated.Value(0),
      opacity2: new Animated.Value(0),
      zIndex: new Animated.Value(-10),
      borderRadius: new Animated.Value(20),
    }
  }

  modalAppear = () => {
    const { containerHeight, containerWidth, opacity, zIndex, borderRadius, opacity2 } = this.state.animation

    Animated.sequence([
      Animated.timing(zIndex, {
        toValue: 10,
        duration: 1,
      }),
      Animated.stagger(450, [
        Animated.timing(containerHeight, {
          toValue: ScreenHeight * 60 / 100,
          duration: 450,
        }),
        Animated.parallel([
          Animated.spring(containerWidth, {
            toValue: ScreenWidth * 80 / 100,
            friction: 4,
            tension: 50,
          }),
          Animated.timing(borderRadius, {
            toValue: 0,
            duration: 250,
          }),
        ]),
        Animated.stagger(200 ,[
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
          }),
          Animated.timing(opacity2, {
            toValue: 1,
            duration: 400,
          }),
        ])
      ])
    ]).start()

  }

  modalDisappear = () => {
    const { containerHeight, containerWidth, opacity, zIndex, borderRadius, opacity2 } = this.state.animation

    Animated.sequence([
      Animated.stagger(200, [
        Animated.stagger( 200,[
          Animated.timing(opacity2, {
            toValue: 0,
            duration: 400,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 400,
          }),
        ]),
        Animated.parallel([
          Animated.timing(borderRadius, {
            toValue: 20,
            duration: 250,
          }),
          Animated.timing(containerWidth, {
            toValue: 58,
            duration: 400,
          }),
        ]),
        Animated.spring(containerHeight, {
          toValue: 60,
          friction: 20,
          tension: 60,
        }),
      ]),
      Animated.timing(zIndex, {
        toValue: -10,
        duration: 1,
      }),
    ]).start();

  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.visible === true){
      this.modalAppear()
    } else {
      this.modalDisappear()
    }
  }

  render () {
    const { dectionLimit, nearbyRadius, category, nearbyLimit } = this.state
    const { containerHeight, containerWidth, opacity, opacity2, zIndex, borderRadius } = this.state.animation

    // if (this.props.visible) {
      return (
        <Animated.View style={[styles.container, {height: containerHeight, width: containerWidth, zIndex}]}>

          <Animated.View style={[styles.heading, {borderRadius}]}>
            <Animated.Text style={[styles.headingText, {opacity}]}>Settings</Animated.Text>
          </Animated.View>

          <Animated.ScrollView
            style={{flex: 1, opacity }}
            contentContainerStyle={styles.scroll}
          >
            <View style={styles.sectionHeader}>
              <Text style={{fontSize: 19, color: red}}>Detection Settings</Text>
            </View>

            {/*Detection Location Radius */}
            <View style={[styles.itemLast, { borderBottomWidth: 0.5, borderBottomColor: red }]}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15}}>Maximum Detected Landmarks: </Text>
                <Text style={{fontSize: 16}}>{dectionLimit}</Text>
              </View>
              <Slider
                step={1}
                value={dectionLimit}
                minimumValue={1}
                maximumValue={5}
                minimumTrackTintColor={red}
                onValueChange={(dectionLimit) => this.setState({dectionLimit})}
              />
              <Animated.Text style={{fontSize: 12, fontStyle: 'italic', textAlign: 'center', opacity: opacity2 }}>
                Maximum number of landmark that can be detected in Detection Mode.
              </Animated.Text>

            </View>

            <View style={styles.sectionHeader}>
              <Text style={{fontSize: 19, color: red}}>Exploration Settings</Text>
            </View>

            {/*Nearby Location Radius */}
            <View style={styles.item}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15}}>Radius of Nearby Landmarks: </Text>
                <Text style={{fontSize: 16, marginRight: 5}}>{nearbyRadius/1000} km</Text>
              </View>
              <Slider
                step={500}
                value={nearbyRadius}
                minimumValue={500}
                maximumValue={5000}
                minimumTrackTintColor={red}
                onValueChange={(nearbyRadius) => this.setState({nearbyRadius})}
              />
            <Animated.Text style={{fontSize: 12, fontStyle: 'italic', textAlign: 'center', opacity: opacity2 }}>
                Maximum number of landmark that are displayed in Nearby Location mode.
              </Animated.Text>

            </View>

            {/*Nearby Location Limit */}
            <View style={styles.item}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15}}>Maximum Nearby Landmarks: </Text>
                <Text style={{fontSize: 16, marginRight: 5}}>{nearbyLimit}</Text>
              </View>
              <Slider
                step={1}
                value={nearbyLimit}
                minimumValue={1}
                maximumValue={10}
                minimumTrackTintColor={red}
                onValueChange={(nearbyLimit) => this.setState({nearbyLimit})}
              />

            <Animated.Text style={{fontSize: 12, fontStyle: 'italic', textAlign: 'center', opacity: opacity2 }}>
                Maximum number of landmark that are displayed in Nearby Location mode.
              </Animated.Text>

            </View>


            {/* Category */}
            <View style={styles.itemLast}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15}}>Select Category: </Text>
              </View>

              <PickerIOS
                style={styles.picker}
                selectedValue={category}
                onValueChange={category => this.setState({category})}
                itemStyle={{color: red}}
              >
                <PickerIOS.Item label="History" value="history" />
                <PickerIOS.Item label="Arts and Meuseums" value="meuseum" />
                <PickerIOS.Item label="Natural Outdoors" value="natural" />
                <PickerIOS.Item label="Religious" value="religious" />
                <PickerIOS.Item label="Night Life" value="nightlife" />
              </PickerIOS>
              <Animated.Text style={{fontSize: 12, fontStyle: 'italic', textAlign: 'center', opacity: opacity2 }}>
                The landmarks from selected category will be displayed in Nearby Location mode.
              </Animated.Text>

            </View>

          </Animated.ScrollView>
        </Animated.View>
      )
    // } else {
    //   return (
    //     <View />
    //   )
    // }
  }
}

export default Settings

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    // height: ScreenHeight * 60 / 100,
    // width: ScreenWidth * 80 / 100,
    backgroundColor: '#eee',
    borderRadius: 20,
  },
  heading: {
    height: 60,
    justifyContent: 'center',
    // alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: red,
    padding: 15,
    backgroundColor: red,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

  },
  headingText: {
    fontSize: 25,
    color: white,
  },
  scroll: {
    // padding: 15,xsitemLast
  },
  sectionHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: red,
    borderBottomWidth: 0.5,
  },
  item: {
    borderBottomWidth: 0.5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  itemLast: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  picker: {
    borderTopColor: red,
    borderTopWidth: 0.3,
    borderBottomColor: red,
    borderBottomWidth: 0.3,
    marginVertical: 10,
  },

})
