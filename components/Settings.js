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
    }
  }


  modalAppear = () => {
    const { paddingHorizontal, containerHeight, containerWidth, opacity, zIndex, borderRadius, borderTopLeftRadius, opacity2 } = this.state.animation
    this.setState({shouldRender:true}, ()=>{
        Animated.sequence([
            Animated.timing(zIndex, {
                toValue: 10,
                duration: 1,
            }),
            Animated.stagger(200, [
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
    const { containerHeight, containerWidth, opacity, zIndex, borderRadius, borderTopLeftRadius, opacity2, paddingHorizontal } = this.state.animation

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
    ]).start(()=>this.setState({shouldRender:false}));


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
    const { containerHeight, containerWidth, opacity, opacity2, zIndex, borderRadius, borderTopLeftRadius, paddingHorizontal } = this.state.animation
    // console.log('settings', settings);
    // console.log('state category', this.state.categories);

    if (this.state.shouldRender) {
      return (
        <Animated.View style={[styles.container, {height: containerHeight, width: containerWidth, zIndex , borderRadius: borderTopLeftRadius}]}>

          <Animated.View style={[styles.heading, { borderRadius, borderTopLeftRadius, borderBottomColor: themeColor, backgroundColor: themeColor, paddingHorizontal}]}>
            <Animated.Text style={[styles.headingText, {opacity}]}> Settings</Animated.Text>
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


              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_TOURISTIC_SITES]: !this.state.categories[CATEGORIES_TOURISTIC_SITES],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_TOURISTIC_SITES]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
                <Text style={{fontSize: 15}}>Touristic Sites </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_AMPHITHEATERS]: !this.state.categories[CATEGORIES_AMPHITHEATERS],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_AMPHITHEATERS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Amphitheaters </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_AQUARIUMS]: !this.state.categories[CATEGORIES_AQUARIUMS],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_AQUARIUMS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Aquariums</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_ART_GALLERIES]: !this.state.categories[CATEGORIES_ART_GALLERIES],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_ART_GALLERIES]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Art Galleries</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_CONCERT_HALLS]: !this.state.categories[CATEGORIES_CONCERT_HALLS],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_CONCERT_HALLS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Concert Halls </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_EXHIBITS]: !this.state.categories[CATEGORIES_EXHIBITS],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_EXHIBITS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Exhibits</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_HISTORIC_SITES]: !this.state.categories[CATEGORIES_HISTORIC_SITES],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_HISTORIC_SITES]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Historic Sites </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_MUSEUMS]: !this.state.categories[CATEGORIES_MUSEUMS],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_MUSEUMS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Museums </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_PUBLIC_ART]: !this.state.categories[CATEGORIES_PUBLIC_ART],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_PUBLIC_ART]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Public Arts</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_STADIUMS]: !this.state.categories[CATEGORIES_STADIUMS],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_STADIUMS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Stadiums</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_ZOOS]: !this.state.categories[CATEGORIES_ZOOS],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_ZOOS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Zoos</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
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
              <Text style={{fontSize: 15}}>Restaurants</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
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
              <Text style={{fontSize: 15}}>Nightlife</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
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
              <Text style={{fontSize: 15}}>Outdoors and Recreations</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_TRAVEL_AND_TRANSPORT]: !this.state.categories[CATEGORIES_TRAVEL_AND_TRANSPORT],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_TRAVEL_AND_TRANSPORT]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Travel and Transport </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_AIRPORTS]: !this.state.categories[CATEGORIES_AIRPORTS],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_AIRPORTS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Airports</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_BUS_STATIONS]: !this.state.categories[CATEGORIES_BUS_STATIONS],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_BUS_STATIONS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Bus Stations</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_TOURIST_INFORMATION_CENTERS]: !this.state.categories[CATEGORIES_TOURIST_INFORMATION_CENTERS],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_TOURIST_INFORMATION_CENTERS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Tourist Information Centers</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.checkbox}
                onPress={() => this.setState({categories: {
                    ...this.state.categories,
                    [CATEGORIES_TRAIN_STATIONS]: !this.state.categories[CATEGORIES_TRAIN_STATIONS],
                  }})
                }
              >
                <MaterialIcons
                  name={categories[CATEGORIES_TRAIN_STATIONS]
                    ? 'check-box'
                    : 'check-box-outline-blank' }
                  size={25} style={{marginRight: 5}}
                  color={themeColor}
                />
              <Text style={{fontSize: 15}}>Train Stations</Text>
              </TouchableOpacity>

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
    } else {
      return (
        <View />
      )
    }
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
    fontSize: 25,
    color: white,
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
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginTop: 5,
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
