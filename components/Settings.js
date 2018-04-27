import React from 'react'
import { View,
         StyleSheet,
         Text,
         ScrollView,
         Slider,
         TouchableOpacity,
         Animated,
         Picker,
         Dimensions } from 'react-native'

import { connect } from 'react-redux'
import { setSettings, changeColor } from '../actions'

import { red, white, teal, black, purple, yellow, } from '../utils/colors'

import {
    CATEGORIES_TOURISTIC_SITES,
    CATEGORIES_AMPHITHEATERS,
    CATEGORIES_AQUARIUMS,
    CATEGORIES_ART_GALLERIES,
    CATEGORIES_CONCERT_HALLS,
    CATEGORIES_EXHIBITS,
    CATEGORIES_HISTORIC_SITES,
    CATEGORIES_MUSEUMS,
    CATEGORIES_PUBLIC_ART,
    CATEGORIES_STADIUMS,
    CATEGORIES_ZOOS,
    CATEGORIES_RESTAURANTS,
    CATEGORIES_NIGHTLIFE_SPOTS,
    CATEGORIES_OUTDOORS_AND_RECREATION,
    CATEGORIES_TRAVEL_AND_TRANSPORT,
    CATEGORIES_AIRPORTS,
    CATEGORIES_BUS_STATIONS,
    CATEGORIES_TOURIST_INFORMATION_CENTERS,
    CATEGORIES_TRAIN_STATIONS,
} from '../utils/helpers';

import { DEFAULT_SETTINGS } from '../utils/helpers'

var ScreenWidth = Dimensions.get('window').width
var ScreenHeight = Dimensions.get('window').height

class Settings extends React.Component {

  state = {
    dectionLimit: this.props.settings.dectionLimit,
    nearbyLimit: this.props.settings.nearbyLimit,
    nearbyRadius: this.props.settings.nearbyRadius,
    categories: {
      [CATEGORIES_TOURISTIC_SITES]: true,
      [CATEGORIES_AMPHITHEATERS]: false,
      [CATEGORIES_AQUARIUMS]: false,
      [CATEGORIES_ART_GALLERIES]: false,
      [CATEGORIES_CONCERT_HALLS]: false,
      [CATEGORIES_EXHIBITS]: false,
      [CATEGORIES_HISTORIC_SITES]: false,
      [CATEGORIES_MUSEUMS]: false,
      [CATEGORIES_PUBLIC_ART]: false,
      [CATEGORIES_STADIUMS]: false,
      [CATEGORIES_ZOOS]: false,
      [CATEGORIES_RESTAURANTS]: false,
      [CATEGORIES_NIGHTLIFE_SPOTS]: false,
      [CATEGORIES_OUTDOORS_AND_RECREATION]: false,
      [CATEGORIES_TRAVEL_AND_TRANSPORT]: false,
      [CATEGORIES_AIRPORTS]: false,
      [CATEGORIES_BUS_STATIONS]: false,
      [CATEGORIES_TOURIST_INFORMATION_CENTERS]: false,
      [CATEGORIES_TRAIN_STATIONS]: false,
    },
    category: this.props.settings.category,
    themeColor: this.props.settings.themeColor,
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
      Animated.stagger(400, [
        Animated.timing(containerHeight, {
          toValue: ScreenHeight * 83 / 100,
          duration: 450,
        }),
        Animated.parallel([
          Animated.spring(containerWidth, {
            toValue: ScreenWidth -30,
            friction: 8,
            tension: 70,
          }),
          Animated.timing(borderRadius, {
            toValue: 0,
            duration: 200,
          }),
        ]),
        Animated.stagger(200 ,[
          Animated.timing(opacity, {
            toValue: 1,
            duration: 1000,
          }),
          Animated.timing(opacity2, {
            toValue: 1,
            duration: 1000,
          }),
        ])
      ])
    ]).start()

  }

  modalDisappear = () => {
    const { containerHeight, containerWidth, opacity, zIndex, borderRadius, opacity2 } = this.state.animation

    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity2, {
          toValue: 0,
          duration: 250,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
        }),
      ]),
      Animated.stagger(150, [
        Animated.timing(containerWidth, {
          toValue: 58,
          duration: 250,
        }),
        Animated.spring(containerHeight, {
          toValue: 60,
          friction: 20,
          tension: 70,
        }),
        Animated.timing(borderRadius, {
          toValue: 20,
          duration: 450,
        }),
      ]),
      Animated.timing(zIndex, {
        toValue: -10,
        duration: 1,
      }),
    ]).start();


  }


  componentWillReceiveProps(nextProps) {
    let newSettings = {
      dectionLimit: this.state.dectionLimit,
      nearbyLimit: this.state.nearbyLimit,
      nearbyRadius: this.state.nearbyRadius,
      category: this.state.category,
      themeColor: this.props.themeColor,
    }

    if (nextProps.visible === true && this.props.visible === false ){
      this.setState({
        dectionLimit: this.props.settings.dectionLimit,
        nearbyLimit: this.props.settings.nearbyLimit,
        nearbyRadius: nextProps.settings.nearbyRadius,
        category: nextProps.settings.category,
        themeColor: this.props.settings.themeColor,
      }, () => {
        this.modalAppear()
      })

    } else if (this.props.visible === true && nextProps.visible === false) {
      this.modalDisappear()
      this.props.changeSettings(newSettings)

    }
  }

  defaultSettings = () => {
    this.setState({
      dectionLimit: DEFAULT_SETTINGS.dectionLimit,
      nearbyLimit: DEFAULT_SETTINGS.nearbyLimit,
      nearbyRadius: DEFAULT_SETTINGS.nearbyLimit,
      category: DEFAULT_SETTINGS.category,
      themeColor:DEFAULT_SETTINGS.themeColor,
    }, () => this.props.changeSettings(DEFAULT_SETTINGS))

  }


  render () {

    const { dectionLimit, nearbyRadius, category, nearbyLimit, categories } = this.state
    const { settings, themeColor } = this.props
    const { containerHeight, containerWidth, opacity, opacity2, zIndex, borderRadius } = this.state.animation


    // console.log('settings', settings);
    // console.log('state', this.state);

    // if (this.props.visible) {
      return (
        <Animated.View style={[styles.container, {height: containerHeight, width: containerWidth, zIndex}]}>

          <Animated.View style={[styles.heading, {borderRadius, borderBottomColor: themeColor, backgroundColor: themeColor}]}>
            <Animated.Text style={[styles.headingText, {opacity}]}>Settings</Animated.Text>
          </Animated.View>

          <Animated.ScrollView
            style={{flex: 1, opacity }}
            contentContainerStyle={styles.scroll}
          >
            <View style={[styles.sectionHeader, {borderBottomColor: themeColor}]}>
              <Text style={{fontSize: 19, color: themeColor}}>Detection Settings</Text>
            </View>

            {/*Detection Location Radius */}
            <View style={[styles.itemLast, { borderBottomWidth: 0.5, borderBottomColor: themeColor }]}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15}}>Maximum Detected Landmarks: </Text>
                { (dectionLimit === null || dectionLimit === 0 || dectionLimit === undefined)
                    ? <Text style={{fontSize: 16}}>{settings.dectionLimit}</Text>
                    : <Text style={{fontSize: 16}}>{dectionLimit}</Text>
                }
              </View>
              <Slider
                step={1}
                value={dectionLimit === null ? settings.dectionLimit : dectionLimit }
                minimumValue={1}
                maximumValue={5}
                minimumTrackTintColor={themeColor}
                onValueChange={(dectionLimit) => this.setState({dectionLimit})}
              />
              <Animated.Text style={{fontSize: 12, fontStyle: 'italic', textAlign: 'center', opacity: opacity2 }}>
                Maximum number of landmark that can be detected in Detection Mode.
              </Animated.Text>

            </View>

            <View style={[styles.sectionHeader, {borderBottomColor: themeColor}]}>
              <Text style={{fontSize: 19, color: themeColor}}>Exploration Settings</Text>
            </View>

            {/*Nearby Location Radius */}
            <View style={styles.item}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15}}>Radius of Nearby Landmarks: </Text>
                { (nearbyRadius === null || nearbyRadius === 0 || nearbyRadius === undefined)
                    ? <Text style={{fontSize: 16}}>{settings.nearbyRadius/1000} km</Text>
                    : <Text style={{fontSize: 16}}>{nearbyRadius/1000} km</Text>
                }
              </View>
              <Slider
                step={500}
                value={nearbyRadius === null ? settings.nearbyRadius : nearbyRadius}
                minimumValue={500}
                maximumValue={5000}
                minimumTrackTintColor={themeColor}
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
                { (nearbyLimit === null || nearbyLimit === 0 || nearbyLimit === undefined)
                    ? <Text style={{fontSize: 16}}>{settings.nearbyLimit}</Text>
                    : <Text style={{fontSize: 16}}>{nearbyLimit}</Text>
                }
              </View>
              <Slider
                step={1}
                value={nearbyLimit === null ? settings.nearbyLimit : nearbyLimit}
                minimumValue={1}
                maximumValue={10}
                minimumTrackTintColor={themeColor}
                onValueChange={(nearbyLimit) => this.setState({nearbyLimit})}
              />

              <Animated.Text style={{fontSize: 12, fontStyle: 'italic', textAlign: 'center', opacity: opacity2 }}>
                Maximum number of landmark that are displayed in Nearby Location mode.
              </Animated.Text>

            </View>


            {/* Category */}
            <View style={styles.item}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15}}>Select Category: </Text>
              </View>



              {/*
                <Picker
                style={[styles.picker, {borderTopColor: themeColor, borderBottomColor: themeColor}]}
                selectedValue={category}
                onValueChange={category => this.setState({category})}
                itemStyle={{color: themeColor}}
              >
                <Picker.Item label="Touristic Sites" value={CATEGORIES_TOURISTIC_SITES} />
                <Picker.Item label="Amphitheaters" value={CATEGORIES_AMPHITHEATERS} />
                <Picker.Item label="Aquariums" value={CATEGORIES_AQUARIUMS} />
                <Picker.Item label="Art Galleries" value={CATEGORIES_ART_GALLERIES} />
                <Picker.Item label="Concert Halls" value={CATEGORIES_CONCERT_HALLS} />
                <Picker.Item label="Exhibits" value={CATEGORIES_EXHIBITS} />
                <Picker.Item label="Historic Sites" value={CATEGORIES_HISTORIC_SITES} />
                <Picker.Item label="Museums" value={CATEGORIES_MUSEUMS} />
                <Picker.Item label="Public Art" value={CATEGORIES_PUBLIC_ART} />
                <Picker.Item label="Stadiums" value={CATEGORIES_STADIUMS} />
                <Picker.Item label="Zoos" value={CATEGORIES_ZOOS} />
                <Picker.Item label="Restaurants" value={CATEGORIES_RESTAURANTS} />
                <Picker.Item label="Nightlife Spots" value={CATEGORIES_NIGHTLIFE_SPOTS} />
                <Picker.Item label="Outdoors & Recreation" value={CATEGORIES_OUTDOORS_AND_RECREATION} />
                <Picker.Item label="Travel & Transport" value={CATEGORIES_TRAVEL_AND_TRANSPORT} />
                <Picker.Item label="Airports" value={CATEGORIES_AIRPORTS} />
                <Picker.Item label="Bus Stations" value={CATEGORIES_BUS_STATIONS} />
                <Picker.Item label="Tourist Information Centers" value={CATEGORIES_TOURIST_INFORMATION_CENTERS} />
                <Picker.Item label="Train Stations" value={CATEGORIES_TRAIN_STATIONS} />
              </Picker>
              */}
              <Animated.Text style={{fontSize: 12, fontStyle: 'italic', textAlign: 'center', opacity: opacity2 }}>
                The landmarks from selected category will be displayed in Nearby Location mode.
              </Animated.Text>
            </View>

            <View style={styles.itemLast}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15}}>Theme: </Text>
              </View>
              <View style={styles.themeList}>
                <TouchableOpacity
                  style={(themeColor === red)
                          ? [styles.themeButton, {backgroundColor: red, borderWidth: 2}]
                          : [styles.themeButton, {backgroundColor: red}]}
                  onPress={() => this.props.changeColor(red)}
                />
                <TouchableOpacity
                  style={(themeColor === teal)
                          ? [styles.themeButton, {backgroundColor: teal, borderWidth: 2}]
                          : [styles.themeButton, {backgroundColor: teal}]}
                  onPress={() => this.props.changeColor(teal)}
                />
                <TouchableOpacity
                  style={(themeColor === purple)
                          ? [styles.themeButton, {backgroundColor: purple, borderWidth: 2}]
                          : [styles.themeButton, {backgroundColor: purple}]}
                  onPress={() => this.props.changeColor(purple)}
                />
                <TouchableOpacity
                  style={(themeColor === yellow)
                          ? [styles.themeButton, {backgroundColor: yellow, borderWidth: 2}]
                          : [styles.themeButton, {backgroundColor: yellow}]}
                  onPress={() => this.props.changeColor(yellow)}
                />
                <TouchableOpacity
                  style={(themeColor === black)
                          ? [styles.themeButton, {backgroundColor: black, borderWidth: 2}]
                          : [styles.themeButton, {backgroundColor: black}]}
                  onPress={() => this.props.changeColor(black)}
                />

              </View>

            </View>

            <TouchableOpacity
              style={[styles.resetButton, {borderTopColor: red}]}
              onPress={this.defaultSettings}
            >
              <Text style={styles.resetButtonText}>
                Reset to Default
              </Text>
            </TouchableOpacity>

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
    padding: 15,
    // borderBottomColor: red,
    // backgroundColor: red,
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
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    marginVertical: 10,
  },
  resetButton: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 0.5,
  },
  resetButtonText: {
    color: red,
    fontSize: 16,
    textAlign: 'center'
  },
  themeList: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeButton: {
    width: 35,
    height: 30,
    borderRadius: 5,
    paddingTop: 10,
    borderColor: '#444',
  }

})

mapStateToProps = (state) => {
  return {
    settings: state.settings,
    themeColor: state.themeColor,
  }
}

mapDispatchToProps = (dispatch) => {
  return {
    changeSettings: (settings, callback) => dispatch(setSettings(settings, callback)),
    changeColor: (color) => dispatch(changeColor(color))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
