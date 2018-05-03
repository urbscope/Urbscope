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
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';


import { red, green, black, blue, yellow, } from '../utils/colors'

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

const FONT_SIZE_SMALLER = ScreenHeight * 0.015
const FONT_SIZE_SMALL   = ScreenHeight * 0.0175
const FONT_SIZE_MEDIUM  = ScreenHeight * 0.02
const FONT_SIZE_LARGE   = ScreenHeight * 0.025
const FONT_SIZE_LARGER  = ScreenHeight * 0.027
const FONT_SIZE_LARGEST = ScreenHeight * 0.034

class Settings extends React.Component {

  state = {
    shouldRender: false,
    dectionLimit: this.props.settings.dectionLimit,
    nearbyLimit: this.props.settings.nearbyLimit,
    nearbyRadius: this.props.settings.nearbyRadius,
    categories: {
      [CATEGORIES_TOURISTIC_SITES]: this.props.settings.categories[CATEGORIES_TOURISTIC_SITES],
      [CATEGORIES_AMPHITHEATERS]: this.props.settings.categories[CATEGORIES_AMPHITHEATERS],
      [CATEGORIES_AQUARIUMS]: this.props.settings.categories[CATEGORIES_AQUARIUMS],
      [CATEGORIES_ART_GALLERIES]: this.props.settings.categories[CATEGORIES_ART_GALLERIES],
      [CATEGORIES_CONCERT_HALLS]: this.props.settings.categories[CATEGORIES_CONCERT_HALLS],
      [CATEGORIES_EXHIBITS]: this.props.settings.categories[CATEGORIES_EXHIBITS],
      [CATEGORIES_HISTORIC_SITES]: this.props.settings.categories[CATEGORIES_HISTORIC_SITES],
      [CATEGORIES_MUSEUMS]: this.props.settings.categories[CATEGORIES_MUSEUMS],
      [CATEGORIES_PUBLIC_ART]: this.props.settings.categories[CATEGORIES_PUBLIC_ART],
      [CATEGORIES_STADIUMS]: this.props.settings.categories[CATEGORIES_STADIUMS],
      [CATEGORIES_ZOOS]: this.props.settings.categories[CATEGORIES_ZOOS],
      [CATEGORIES_RESTAURANTS]: this.props.settings.categories[CATEGORIES_RESTAURANTS],
      [CATEGORIES_NIGHTLIFE_SPOTS]: this.props.settings.categories[CATEGORIES_NIGHTLIFE_SPOTS],
      [CATEGORIES_OUTDOORS_AND_RECREATION]: this.props.settings.categories[CATEGORIES_OUTDOORS_AND_RECREATION],
      [CATEGORIES_TRAVEL_AND_TRANSPORT]: this.props.settings.categories[CATEGORIES_TRAVEL_AND_TRANSPORT],
      [CATEGORIES_AIRPORTS]: this.props.settings.categories[CATEGORIES_AIRPORTS],
      [CATEGORIES_BUS_STATIONS]: this.props.settings.categories[CATEGORIES_BUS_STATIONS],
      [CATEGORIES_TOURIST_INFORMATION_CENTERS]: this.props.settings.categories[CATEGORIES_TOURIST_INFORMATION_CENTERS],
      [CATEGORIES_TRAIN_STATIONS]: this.props.settings.categories[CATEGORIES_TRAIN_STATIONS],
    },
    category: this.props.settings.category,
    themeColor: this.props.themeColor,
    animation: {
      containerHeight: new Animated.Value(58),
      containerWidth: new Animated.Value(10),
      opacity: new Animated.Value(0),
      zIndex: new Animated.Value(-10),
      borderRadius: new Animated.Value(10),
      paddingHorizontal: new Animated.Value (0),
      borderTopLeftRadius: new Animated.Value(0),
      backdropOpacity: new Animated.Value(0),
      backdropZ: new Animated.Value(-10)
    }
  }


  modalAppear = () => {
    const { paddingHorizontal, containerHeight, containerWidth, opacity, zIndex, borderRadius, borderTopLeftRadius, opacity2, backdropOpacity, backdropZ } = this.state.animation
    this.setState({shouldRender:true}, ()=>{
        Animated.sequence([
            Animated.timing(zIndex, {
                toValue: 15,
                duration: 1,
            }),
            Animated.timing(backdropZ, {
                toValue: 14,
                duration: 1,
            }),
            Animated.stagger(200, [
              Animated.timing(backdropOpacity, {
                  toValue: 0.5,
                  duration: 1000,
              }),
              Animated.parallel([
                Animated.timing(containerWidth, {
                    toValue: ScreenWidth -30,
                    duration: 300,
                }),
                Animated.timing(paddingHorizontal, {
                    toValue: 15,
                    duration: 300,
                }),
                Animated.timing(borderRadius, {
                    toValue: 0,
                    duration: 300,
                }),
              ]),
              Animated.timing(borderTopLeftRadius, {
                  toValue: 10,
                  duration: 250,
              }),
              Animated.spring(containerHeight, {
                  toValue: ScreenHeight * 83 / 100,
                  friction: 8,
                  tension: 70,
              }),
              Animated.timing(opacity, {
                  toValue: 1,
                  duration: 1000,
              }),

            ])
        ]).start()
    });

  }

  modalDisappear = () => {
    const { containerHeight, containerWidth, opacity, zIndex, borderRadius, borderTopLeftRadius, opacity2, paddingHorizontal, backdropZ, backdropOpacity } = this.state.animation
    Animated.stagger(100, [
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 1000,
      }),
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
        }),
        Animated.timing(paddingHorizontal, {
          toValue: 0,
          duration: 1,
        }),
        Animated.stagger(300, [
          Animated.timing(containerHeight, {
            toValue: 58,
            duration: 300,
          }),
          Animated.parallel([
            Animated.timing(borderTopLeftRadius, {
              toValue: 0,
              duration: 150,
            }),
            Animated.timing(containerWidth, {
              toValue: 10,
              duration: 300,
            }),
            Animated.timing(borderRadius, {
              toValue: 10,
              duration: 300,
            }),
          ]),
        ]),
        Animated.timing(zIndex, {
          toValue: -10,
          duration: 1,
        }),
        Animated.timing(backdropZ, {
          toValue: -10,
          duration: 1,
        }),
      ])
    ])
    .start(()=>this.setState({shouldRender:false}));


  }


  componentWillReceiveProps(nextProps) {
    let newSettings = {
      dectionLimit: this.state.dectionLimit,
      nearbyLimit: this.state.nearbyLimit,
      nearbyRadius: this.state.nearbyRadius,
      categories: this.state.categories,
      themeColor: this.props.themeColor,
    }

    if (nextProps.visible === true && this.props.visible === false ){
      this.setState({
        dectionLimit: this.props.settings.dectionLimit,
        nearbyLimit: this.props.settings.nearbyLimit,
        nearbyRadius: nextProps.settings.nearbyRadius,
        categories: nextProps.settings.categories,
        themeColor: nextProps.settings.themeColor,
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
      categories: {
        [CATEGORIES_TOURISTIC_SITES]: DEFAULT_SETTINGS.categories[CATEGORIES_TOURISTIC_SITES],
        [CATEGORIES_AMPHITHEATERS]: DEFAULT_SETTINGS.categories[CATEGORIES_AMPHITHEATERS],
        [CATEGORIES_AQUARIUMS]: DEFAULT_SETTINGS.categories[CATEGORIES_AQUARIUMS],
        [CATEGORIES_ART_GALLERIES]: DEFAULT_SETTINGS.categories[CATEGORIES_ART_GALLERIES],
        [CATEGORIES_CONCERT_HALLS]: DEFAULT_SETTINGS.categories[CATEGORIES_CONCERT_HALLS],
        [CATEGORIES_EXHIBITS]: DEFAULT_SETTINGS.categories[CATEGORIES_EXHIBITS],
        [CATEGORIES_HISTORIC_SITES]: DEFAULT_SETTINGS.categories[CATEGORIES_HISTORIC_SITES],
        [CATEGORIES_MUSEUMS]: DEFAULT_SETTINGS.categories[CATEGORIES_MUSEUMS],
        [CATEGORIES_PUBLIC_ART]: DEFAULT_SETTINGS.categories[CATEGORIES_PUBLIC_ART],
        [CATEGORIES_STADIUMS]: DEFAULT_SETTINGS.categories[CATEGORIES_STADIUMS],
        [CATEGORIES_ZOOS]: DEFAULT_SETTINGS.categories[CATEGORIES_ZOOS],
        [CATEGORIES_RESTAURANTS]: DEFAULT_SETTINGS.categories[CATEGORIES_RESTAURANTS],
        [CATEGORIES_NIGHTLIFE_SPOTS]: DEFAULT_SETTINGS.categories[CATEGORIES_NIGHTLIFE_SPOTS],
        [CATEGORIES_OUTDOORS_AND_RECREATION]: DEFAULT_SETTINGS.categories[CATEGORIES_OUTDOORS_AND_RECREATION],
        [CATEGORIES_TRAVEL_AND_TRANSPORT]: DEFAULT_SETTINGS.categories[CATEGORIES_TRAVEL_AND_TRANSPORT],
        [CATEGORIES_AIRPORTS]: DEFAULT_SETTINGS.categories[CATEGORIES_AIRPORTS],
        [CATEGORIES_BUS_STATIONS]: DEFAULT_SETTINGS.categories[CATEGORIES_BUS_STATIONS],
        [CATEGORIES_TOURIST_INFORMATION_CENTERS]: DEFAULT_SETTINGS.categories[CATEGORIES_TOURIST_INFORMATION_CENTERS],
        [CATEGORIES_TRAIN_STATIONS]: DEFAULT_SETTINGS.categories[CATEGORIES_TRAIN_STATIONS],
      },

      themeColor:DEFAULT_SETTINGS.themeColor,
    }, () => this.props.changeSettings(DEFAULT_SETTINGS))

  }


  render () {

    const { dectionLimit, nearbyRadius, category, nearbyLimit, categories } = this.state;
    const { settings, themeColor } = this.props;
    const { containerHeight, containerWidth, opacity, opacity2, zIndex, borderRadius, borderTopLeftRadius, paddingHorizontal, backdropZ, backdropOpacity } = this.state.animation
    // console.log('settings', settings);
    // console.log('state category', this.state.categories);

    if (this.state.shouldRender) {
      return (
//

        <Animated.View style={{position: 'absolute', height: '100%', width: '100%', zIndex: backdropZ}}>
          <Animated.View style={[styles.backdrop, {opacity: backdropOpacity}]}></Animated.View>

        <Animated.View style={[styles.container, {height: containerHeight, width: containerWidth, zIndex , borderRadius: borderTopLeftRadius}]}>

          <Animated.View style={[styles.heading, { borderRadius, borderTopLeftRadius, borderBottomColor: themeColor, backgroundColor: themeColor, paddingHorizontal}]}>
            <Animated.Text style={[styles.headingText, {opacity}]}> Settings</Animated.Text>
          </Animated.View>


          <Animated.ScrollView
            style={{flex: 1, opacity }}
            contentContainerStyle={styles.scroll}
          >
            <View style={[styles.sectionHeader, {borderBottomColor: themeColor}]}>
              <Text style={{fontSize: FONT_SIZE_LARGER, color: themeColor}}>Detection Settings</Text>
            </View>

            {/*Detection Location Radius */}
            <View style={[styles.itemLast, { borderBottomWidth: 0.5, borderBottomColor: themeColor }]}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: FONT_SIZE_MEDIUM}}>Maximum Detected Landmarks: </Text>
                { (dectionLimit === null || dectionLimit === 0 || dectionLimit === undefined)
                    ? <Text style={{fontSize: FONT_SIZE_LARGE, color: themeColor}}>{settings.dectionLimit}</Text>
                    : <Text style={{fontSize: FONT_SIZE_LARGE, color: themeColor}}>{dectionLimit}</Text>
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
              <Animated.Text style={{fontSize: FONT_SIZE_SMALLER,  opacity: opacity2 }}>
                Maximum number of landmark that can be detected in Detection Mode.
              </Animated.Text>

            </View>

            <View style={[styles.sectionHeader, {borderBottomColor: themeColor}]}>
              <Text style={{fontSize: FONT_SIZE_LARGER, color: themeColor}}>Exploration Settings</Text>
            </View>

            {/*Nearby Location Radius */}
            <View style={styles.item}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: FONT_SIZE_MEDIUM}}>Radius of Nearby Landmarks: </Text>
                { (nearbyRadius === null || nearbyRadius === 0 || nearbyRadius === undefined)
                    ? <Text style={{fontSize: FONT_SIZE_LARGE, color: themeColor}}>{settings.nearbyRadius/1000} km</Text>
                    : <Text style={{fontSize: FONT_SIZE_LARGE, color: themeColor}}>{nearbyRadius/1000} km</Text>
                }
              </View>
              <Slider
                step={1000}
                value={nearbyRadius === null ? settings.nearbyRadius : nearbyRadius}
                minimumValue={1000}
                maximumValue={25000}
                minimumTrackTintColor={themeColor}
                onValueChange={(nearbyRadius) => this.setState({nearbyRadius})}
              />
            <Animated.Text style={{fontSize: FONT_SIZE_SMALLER,  opacity: opacity2 }}>
              Maximum number of landmark that are displayed in Nearby Location mode.
            </Animated.Text>

            </View>

            {/*Nearby Location Limit */}
            <View style={styles.item}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: FONT_SIZE_MEDIUM}}>Maximum Nearby Landmarks: </Text>
                { (nearbyLimit === null || nearbyLimit === 0 || nearbyLimit === undefined)
                    ? <Text style={{fontSize: FONT_SIZE_LARGE, color: themeColor}}>{settings.nearbyLimit}</Text>
                    : <Text style={{fontSize: FONT_SIZE_LARGE, color: themeColor}}>{nearbyLimit}</Text>
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

              <Animated.Text style={{fontSize: FONT_SIZE_SMALLER,  opacity: opacity2 }}>
                Maximum number of landmark that are displayed in Nearby Location mode.
              </Animated.Text>

            </View>


            {/* Category */}
            <View style={[styles.item, {borderColor: themeColor}]}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: FONT_SIZE_MEDIUM}}>Select categories: </Text>
              </View>


              <TouchableOpacity style={[styles.checkboxMainCat, {borderBottomWidth:2, borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_TOURISTIC_SITES]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TOURISTIC_SITES]: false,
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
                    }})
                  } else {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TOURISTIC_SITES]: true,
                      [CATEGORIES_AMPHITHEATERS]: true,
                      [CATEGORIES_AQUARIUMS]: true,
                      [CATEGORIES_ART_GALLERIES]: true,
                      [CATEGORIES_CONCERT_HALLS]: true,
                      [CATEGORIES_EXHIBITS]: true,
                      [CATEGORIES_HISTORIC_SITES]: true,
                      [CATEGORIES_MUSEUMS]: true,
                      [CATEGORIES_PUBLIC_ART]: true,
                      [CATEGORIES_STADIUMS]: true,
                      [CATEGORIES_ZOOS]: true,
                    }})
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_TOURISTIC_SITES]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_MEDIUM, fontWeight: '600'}}>Touristic Sites </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor, paddingTop: 10}]}
                onPress={() => {
                  if (categories[CATEGORIES_AMPHITHEATERS]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TOURISTIC_SITES]: false,
                      [CATEGORIES_AMPHITHEATERS]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_AQUARIUMS] &&
                      categories[CATEGORIES_ART_GALLERIES] &&
                      categories[CATEGORIES_CONCERT_HALLS] &&
                      categories[CATEGORIES_EXHIBITS] &&
                      categories[CATEGORIES_HISTORIC_SITES] &&
                      categories[CATEGORIES_MUSEUMS] &&
                      categories[CATEGORIES_PUBLIC_ART] &&
                      categories[CATEGORIES_STADIUMS] &&
                      categories[CATEGORIES_ZOOS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TOURISTIC_SITES]: true,
                          [CATEGORIES_AMPHITHEATERS]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_AMPHITHEATERS]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_AMPHITHEATERS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Amphitheaters </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_AQUARIUMS]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TOURISTIC_SITES]: false,
                      [CATEGORIES_AQUARIUMS]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_AMPHITHEATERS] &&
                      categories[CATEGORIES_ART_GALLERIES] &&
                      categories[CATEGORIES_CONCERT_HALLS] &&
                      categories[CATEGORIES_EXHIBITS] &&
                      categories[CATEGORIES_HISTORIC_SITES] &&
                      categories[CATEGORIES_MUSEUMS] &&
                      categories[CATEGORIES_PUBLIC_ART] &&
                      categories[CATEGORIES_STADIUMS] &&
                      categories[CATEGORIES_ZOOS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TOURISTIC_SITES]: true,
                          [CATEGORIES_AQUARIUMS]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_AQUARIUMS]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_AQUARIUMS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Aquariums</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_ART_GALLERIES]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TOURISTIC_SITES]: false,
                      [CATEGORIES_ART_GALLERIES]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_AMPHITHEATERS] &&
                      categories[CATEGORIES_AQUARIUMS] &&
                      categories[CATEGORIES_CONCERT_HALLS] &&
                      categories[CATEGORIES_EXHIBITS] &&
                      categories[CATEGORIES_HISTORIC_SITES] &&
                      categories[CATEGORIES_MUSEUMS] &&
                      categories[CATEGORIES_PUBLIC_ART] &&
                      categories[CATEGORIES_STADIUMS] &&
                      categories[CATEGORIES_ZOOS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TOURISTIC_SITES]: true,
                          [CATEGORIES_ART_GALLERIES]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_ART_GALLERIES]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_ART_GALLERIES]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Art Galleries</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_CONCERT_HALLS]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TOURISTIC_SITES]: false,
                      [CATEGORIES_CONCERT_HALLS]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_AMPHITHEATERS] &&
                      categories[CATEGORIES_AQUARIUMS] &&
                      categories[CATEGORIES_ART_GALLERIES] &&
                      categories[CATEGORIES_EXHIBITS] &&
                      categories[CATEGORIES_HISTORIC_SITES] &&
                      categories[CATEGORIES_MUSEUMS] &&
                      categories[CATEGORIES_PUBLIC_ART] &&
                      categories[CATEGORIES_STADIUMS] &&
                      categories[CATEGORIES_ZOOS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TOURISTIC_SITES]: true,
                          [CATEGORIES_CONCERT_HALLS]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_CONCERT_HALLS]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_CONCERT_HALLS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Concert Halls </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_EXHIBITS]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TOURISTIC_SITES]: false,
                      [CATEGORIES_EXHIBITS]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_AMPHITHEATERS] &&
                      categories[CATEGORIES_AQUARIUMS] &&
                      categories[CATEGORIES_ART_GALLERIES] &&
                      categories[CATEGORIES_CONCERT_HALLS] &&
                      categories[CATEGORIES_HISTORIC_SITES] &&
                      categories[CATEGORIES_MUSEUMS] &&
                      categories[CATEGORIES_PUBLIC_ART] &&
                      categories[CATEGORIES_STADIUMS] &&
                      categories[CATEGORIES_ZOOS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TOURISTIC_SITES]: true,
                          [CATEGORIES_EXHIBITS]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_EXHIBITS]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_EXHIBITS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Exhibits</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_HISTORIC_SITES]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TOURISTIC_SITES]: false,
                      [CATEGORIES_HISTORIC_SITES]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_AMPHITHEATERS] &&
                      categories[CATEGORIES_AQUARIUMS] &&
                      categories[CATEGORIES_ART_GALLERIES] &&
                      categories[CATEGORIES_CONCERT_HALLS] &&
                      categories[CATEGORIES_EXHIBITS] &&
                      categories[CATEGORIES_MUSEUMS] &&
                      categories[CATEGORIES_PUBLIC_ART] &&
                      categories[CATEGORIES_STADIUMS] &&
                      categories[CATEGORIES_ZOOS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TOURISTIC_SITES]: true,
                          [CATEGORIES_HISTORIC_SITES]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_HISTORIC_SITES]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_HISTORIC_SITES]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Historic Sites </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_MUSEUMS]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TOURISTIC_SITES]: false,
                      [CATEGORIES_MUSEUMS]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_AMPHITHEATERS] &&
                      categories[CATEGORIES_AQUARIUMS] &&
                      categories[CATEGORIES_ART_GALLERIES] &&
                      categories[CATEGORIES_CONCERT_HALLS] &&
                      categories[CATEGORIES_EXHIBITS] &&
                      categories[CATEGORIES_HISTORIC_SITES] &&
                      categories[CATEGORIES_PUBLIC_ART] &&
                      categories[CATEGORIES_STADIUMS] &&
                      categories[CATEGORIES_ZOOS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TOURISTIC_SITES]: true,
                          [CATEGORIES_MUSEUMS]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_MUSEUMS]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_MUSEUMS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Museums </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_PUBLIC_ART]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TOURISTIC_SITES]: false,
                      [CATEGORIES_PUBLIC_ART]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_AMPHITHEATERS] &&
                      categories[CATEGORIES_AQUARIUMS] &&
                      categories[CATEGORIES_ART_GALLERIES] &&
                      categories[CATEGORIES_CONCERT_HALLS] &&
                      categories[CATEGORIES_EXHIBITS] &&
                      categories[CATEGORIES_HISTORIC_SITES] &&
                      categories[CATEGORIES_MUSEUMS] &&
                      categories[CATEGORIES_STADIUMS] &&
                      categories[CATEGORIES_ZOOS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TOURISTIC_SITES]: true,
                          [CATEGORIES_PUBLIC_ART]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_PUBLIC_ART]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_PUBLIC_ART]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Public Arts</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_STADIUMS]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TOURISTIC_SITES]: false,
                      [CATEGORIES_STADIUMS]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_AMPHITHEATERS] &&
                      categories[CATEGORIES_AQUARIUMS] &&
                      categories[CATEGORIES_ART_GALLERIES] &&
                      categories[CATEGORIES_CONCERT_HALLS] &&
                      categories[CATEGORIES_EXHIBITS] &&
                      categories[CATEGORIES_HISTORIC_SITES] &&
                      categories[CATEGORIES_MUSEUMS] &&
                      categories[CATEGORIES_PUBLIC_ART] &&
                      categories[CATEGORIES_ZOOS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TOURISTIC_SITES]: true,
                          [CATEGORIES_STADIUMS]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_STADIUMS]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_STADIUMS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Stadiums</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_ZOOS]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TOURISTIC_SITES]: false,
                      [CATEGORIES_ZOOS]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_AMPHITHEATERS] &&
                      categories[CATEGORIES_AQUARIUMS] &&
                      categories[CATEGORIES_ART_GALLERIES] &&
                      categories[CATEGORIES_CONCERT_HALLS] &&
                      categories[CATEGORIES_EXHIBITS] &&
                      categories[CATEGORIES_HISTORIC_SITES] &&
                      categories[CATEGORIES_MUSEUMS] &&
                      categories[CATEGORIES_PUBLIC_ART] &&
                      categories[CATEGORIES_STADIUMS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TOURISTIC_SITES]: true,
                          [CATEGORIES_ZOOS]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_ZOOS]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_ZOOS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Zoos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkboxMainCat}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_RESTAURANTS]: !this.state.categories[CATEGORIES_RESTAURANTS],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_RESTAURANTS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_MEDIUM, fontWeight: '600'}}>Restaurants</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkboxMainCat}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_NIGHTLIFE_SPOTS]: !this.state.categories[CATEGORIES_NIGHTLIFE_SPOTS],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_NIGHTLIFE_SPOTS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_MEDIUM, fontWeight: '600'}}>Nightlife</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkboxMainCat}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_OUTDOORS_AND_RECREATION]: !this.state.categories[CATEGORIES_OUTDOORS_AND_RECREATION],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_OUTDOORS_AND_RECREATION]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_MEDIUM, fontWeight: '600'}}>Outdoors and Recreations</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxMainCat, {borderBottomWidth:2, borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_TRAVEL_AND_TRANSPORT]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TRAVEL_AND_TRANSPORT]: false,
                      [CATEGORIES_AIRPORTS]: false,
                      [CATEGORIES_BUS_STATIONS]: false,
                      [CATEGORIES_TOURIST_INFORMATION_CENTERS]: false,
                      [CATEGORIES_TRAIN_STATIONS]: false,
                    }})
                  } else {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TRAVEL_AND_TRANSPORT]: true,
                      [CATEGORIES_AIRPORTS]: true,
                      [CATEGORIES_BUS_STATIONS]: true,
                      [CATEGORIES_TOURIST_INFORMATION_CENTERS]: true,
                      [CATEGORIES_TRAIN_STATIONS]: true,
                    }})
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_TRAVEL_AND_TRANSPORT]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_MEDIUM, fontWeight: '600'}}>Travel and Transport </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor, paddingTop: 10}]}
                onPress={() => {
                  if (categories[CATEGORIES_AIRPORTS]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TRAVEL_AND_TRANSPORT]: false,
                      [CATEGORIES_AIRPORTS]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_BUS_STATIONS] &&
                      categories[CATEGORIES_TOURIST_INFORMATION_CENTERS] &&
                      categories[CATEGORIES_TRAIN_STATIONS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TRAVEL_AND_TRANSPORT]: true,
                          [CATEGORIES_AIRPORTS]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_AIRPORTS]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_AIRPORTS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Airports</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_BUS_STATIONS]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TRAVEL_AND_TRANSPORT]: false,
                      [CATEGORIES_BUS_STATIONS]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_AIRPORTS] &&
                      categories[CATEGORIES_TOURIST_INFORMATION_CENTERS] &&
                      categories[CATEGORIES_TRAIN_STATIONS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TRAVEL_AND_TRANSPORT]: true,
                          [CATEGORIES_BUS_STATIONS]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_BUS_STATIONS]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_BUS_STATIONS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Bus Stations</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_TOURIST_INFORMATION_CENTERS]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TRAVEL_AND_TRANSPORT]: false,
                      [CATEGORIES_TOURIST_INFORMATION_CENTERS]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_AIRPORTS] &&
                      categories[CATEGORIES_BUS_STATIONS] &&
                      categories[CATEGORIES_TRAIN_STATIONS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TRAVEL_AND_TRANSPORT]: true,
                          [CATEGORIES_TOURIST_INFORMATION_CENTERS]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_TOURIST_INFORMATION_CENTERS]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_TOURIST_INFORMATION_CENTERS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Tourist Information Centers</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.checkboxSubCat, {borderColor: themeColor}]}
                onPress={() => {
                  if (categories[CATEGORIES_TRAIN_STATIONS]) {
                    this.setState({categories: {
                      ...categories,
                      [CATEGORIES_TRAVEL_AND_TRANSPORT]: false,
                      [CATEGORIES_TRAIN_STATIONS]: false,
                    }})
                  } else {
                    if (
                      categories[CATEGORIES_AIRPORTS] &&
                      categories[CATEGORIES_BUS_STATIONS] &&
                      categories[CATEGORIES_TOURIST_INFORMATION_CENTERS]
                    ) {
                        this.setState({categories: {
                          ...categories,
                          [CATEGORIES_TRAVEL_AND_TRANSPORT]: true,
                          [CATEGORIES_TRAIN_STATIONS]: true,
                        }})
                    } else {
                      this.setState({categories: {
                        ...categories,
                        [CATEGORIES_TRAIN_STATIONS]: true,
                      }})
                    }
                  }
                }}
              >
                <MaterialIcons
                  name={categories[CATEGORIES_TRAIN_STATIONS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: FONT_SIZE_SMALL}}>Train Stations</Text>
              </TouchableOpacity>

              <Animated.Text style={{fontSize: FONT_SIZE_SMALLER,  opacity: opacity2, marginTop: 10 }}>
                The landmarks from selected category will be displayed in Nearby Location mode.
              </Animated.Text>
            </View>

            <View style={[styles.sectionHeader, {borderBottomColor: themeColor}]}>
              <Text style={{fontSize: FONT_SIZE_LARGER, color: themeColor}}>General Settings</Text>
            </View>

            <View style={styles.itemLast}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: FONT_SIZE_MEDIUM}}>Theme: </Text>
              </View>
              <View style={styles.themeList}>
                <TouchableOpacity
                  style={(themeColor === red)
                          ? [styles.themeButton, {backgroundColor: red,
                              shadowColor: '#000', shadowRadius: 3, shadowOpacity: 0.6,
                              shadowOffset: {
                                width: 1,
                                height: 1
                              }}]
                          : [styles.themeButton, {backgroundColor: red}]}
                  onPress={() => this.props.changeColor(red)}
                />
                <TouchableOpacity
                  style={(themeColor === green)
                          ? [styles.themeButton, {backgroundColor: green,
                              shadowColor: '#000', shadowRadius: 3, shadowOpacity: 0.6,
                              shadowOffset: {
                                width: 1,
                                height: 1
                              }}]
                          : [styles.themeButton, {backgroundColor: green}]}
                  onPress={() => this.props.changeColor(green)}
                />
                <TouchableOpacity
                  style={(themeColor === blue)
                          ? [styles.themeButton, {backgroundColor: blue,
                              shadowColor: '#000', shadowRadius: 3, shadowOpacity: 0.6,
                              shadowOffset: {
                                width: 1,
                                height: 1
                              }}]
                          : [styles.themeButton, {backgroundColor: blue}]}
                  onPress={() => this.props.changeColor(blue)}
                />
                <TouchableOpacity
                  style={(themeColor === yellow)
                          ? [styles.themeButton, {backgroundColor: yellow,
                              shadowColor: '#000', shadowRadius: 3, shadowOpacity: 0.6,
                              shadowOffset: {
                                width: 1,
                                height: 1
                              }}]
                          : [styles.themeButton, {backgroundColor: yellow}]}
                  onPress={() => this.props.changeColor(yellow)}
                />
                <TouchableOpacity
                  style={(themeColor === black)
                          ? [styles.themeButton, {backgroundColor: black,
                              shadowColor: '#000', shadowRadius: 3, shadowOpacity: 0.6,
                              shadowOffset: {
                                width: 1,
                                height: 1
                              }}]
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
      </Animated.View>



      )
    } else {
      return (
        <View />
      )
    }
  }
}


const styles = StyleSheet.create({
  backdrop: {
    opacity: 0.5,
    position: 'absolute',
    height: ScreenHeight,
    width: ScreenWidth,
    backgroundColor: '#000',
  },
  container: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    // height: ScreenHeight * 60 / 100,
    // width: ScreenWidth * 80 / 100,
    backgroundColor: '#eee',
    // borderRadius: 10,

    // borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,

  },
  heading: {
    height: 60,

    justifyContent: 'center',
    // alignItems: 'center',
    borderBottomWidth: 1,


    // borderBottomColor: red,
    // backgroundColor: red,
    // borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,

  },
  headingText: {
    fontSize: FONT_SIZE_LARGEST,
    color: '#fff',
  },
  scroll: {
    // padding: 15,xsitemLast
  },
  sectionHeader: {
    justifyContent: 'center',
    // alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
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
    fontSize: FONT_SIZE_LARGE,
    textAlign: 'center'
  },
  themeList: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeButton: {
    width: '15%',
    height: 30,
    borderRadius: 5,
    paddingTop: 10,
    borderColor: '#444',
  },
  checkboxSubCat: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,

    marginLeft: ScreenWidth*0.04,
    // backgroundColor: '#ddd',
    borderLeftWidth: 1,
    // borderRadius: 5,
    // borderBottomWidth: 0.25,
    // marginTop: 5,
  },
  checkboxMainCat: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    // backgroundColor: '#e8e8e8',
    borderRadius: 5,
    // marginTop: 5,
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
