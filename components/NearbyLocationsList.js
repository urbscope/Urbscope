import React, { Component } from 'react'
import { StyleSheet,
  ScrollView,
  Dimensions,
  View,
  Text,
  Platform,
  Image,
  ActivityIndicator,
  Animated,
  PanResponder,
  TouchableOpacity} from "react-native"

  import { connect } from 'react-redux'

  const ScreenHeight = Dimensions.get('window').height
  const ScreenWidth  = Dimensions.get('window').width

  const FONT_SIZE_SMALLER = ScreenHeight * 0.014
  const FONT_SIZE_SMALL   = ScreenHeight * 0.0175
  const FONT_SIZE_MEDIUM  = ScreenHeight * 0.02
  const FONT_SIZE_LARGE   = ScreenHeight * 0.025
  const FONT_SIZE_LARGER  = ScreenHeight * 0.027
  const FONT_SIZE_LARGEST = ScreenHeight * 0.034

  class NearbyLocationsList extends React.Component {


    constructor(props) {
      super(props);

      this.state = {
        listViewPosition: new Animated.ValueXY(),
        loading: true,
      };


      this._panResponder = PanResponder.create({
        onMoveShouldSetResponderCapture: () => true,
        onMoveShouldSetPanResponderCapture: () => true,

        // Initially, set the value of x and y to 0 (the center of the screen)
        onPanResponderGrant: (e, gestureState) => {
          this.state.listViewPosition.setOffset({x: this.state.listViewPosition.x._value, y: this.state.listViewPosition.y._value});
          this.state.listViewPosition.setValue({x: 0, y: 0});
        },

        // When we drag/pan the object, set the delate to the states pan position
        onPanResponderMove: Animated.event([
          null, {dx: this.state.listViewPosition.x, dy: 0},
        ]),

        onPanResponderRelease: (e, {moveX, vx}) => {
          this.state.listViewPosition.flattenOffset();

          if (moveX < ScreenWidth * 0.4 || vx < -1.5) {
            Animated.spring(this.state.listViewPosition, { toValue: {x: 0, y: 0}, friction: 7, tension: 20}).start();
          } else if (moveX > ScreenWidth * 0.4 || vx > 1.5) {
            Animated.spring(this.state.listViewPosition, { toValue: {x: ScreenWidth-20, y: 0}, friction: 7, tension: 20}).start();
          }
        }

      })
    }

    componentWillReceiveProps(nextProps){
      if (nextProps.listLoading === false) {
        this.setState({loading: false})
      } else  {
        this.setState({loading: true})
      }
    }


    render() {
      console.log(this.props.loading)

      const { listViewPosition } = this.state


      const { locations, themeColor, sponsoredLocation } = this.props


      let [translateX, translateY] = [listViewPosition.x, listViewPosition.y];
      let imageStyle = {transform: [{translateX}, {translateY}]};

      // console.log(locations);
      // let locations = this.props.locations;


      return (
        <Animated.View style={[styles.listWindow, imageStyle]} >

          <View style={[styles.listWindowDrag, {backgroundColor: themeColor}]}
            {...this._panResponder.panHandlers}>
            <View style={styles.listWindowDragLine}>
            </View>
          </View>

          {(this.props.loading === true)
            ? (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator
                  size="small"
                  color={'#555'}
                  animating={this.props.loading}
                  />
              </View>
            )
            : (
              <ScrollView style={styles.listContainer} >
                {sponsoredLocation
                  ? (
                    <View>
                      <View style={[styles.sponsorHeader, {backgroundColor: themeColor}]}>
                        <Text style={{color: '#fff', fontSize: FONT_SIZE_MEDIUM, fontWeight: '200'}}>
                          We recommend
                        </Text>
                      </View>
                      <TouchableOpacity
                        key={sponsoredLocation.key}
                        onPress={()=> {
                          this.props.handlePress(sponsoredLocation.key)

                        }}
                        >
                        <View style={[styles.listItem, {borderBottomWidth: 0}]} >
                          {sponsoredLocation.picture
                            ?(<Image style={styles.Image}
                              source={{uri: sponsoredLocation.picture}}/>)
                              :(<Image style={styles.Image}
                                source={require('../assets/urbscope_loading.png')}/>)
                              }

                              <View style={styles.listItemDetails}>
                                <Text style={{fontSize: FONT_SIZE_MEDIUM, fontWeight: '600'}}>
                                  {sponsoredLocation.name}
                                </Text>
                                <Text style={{fontSize: FONT_SIZE_SMALL, color: themeColor, fontWeight: '200'}}>
                                  {sponsoredLocation.category}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>)
                        : null}

                        <View style={[styles.sponsorHeader, {backgroundColor: themeColor}]}>
                          <Text style={{color: '#fff', fontSize: FONT_SIZE_MEDIUM, fontWeight: '200'}}>
                            Nearby locations
                          </Text>
                        </View>
                        {locations.map( (val, index) => {
                          return (
                            <TouchableOpacity
                              key={val.key}
                              onPress={()=> {
                                this.props.handlePress(val.key)
                                setTimeout(() => {
                                  Animated.spring(this.state.listViewPosition, { toValue: {x: 0, y: 0}, friction: 7, tension: 20}).start();
                                }, 500)

                              }}
                              >
                              <View
                                style={(index === locations.length - 1 )
                                  ? [styles.listItem, {borderBottomWidth: 0}]
                                  : styles.listItem }
                                  >
                                  {val.picture
                                    ?(<Image style={styles.Image}
                                      source={{uri: val.picture}}/>)
                                      :(<Image style={styles.Image}
                                        source={require('../assets/urbscope_loading.png')}/>)
                                      }

                                      <View style={styles.listItemDetails}>
                                        <Text style={{fontSize: FONT_SIZE_MEDIUM, fontWeight: '600'}}>
                                          {val.name}
                                        </Text>
                                        <Text style={{fontSize: FONT_SIZE_SMALLER, fontWeight: '200'}}>
                                          {val.address[0]}
                                        </Text>
                                        <Text style={{color: themeColor, fontSize: FONT_SIZE_SMALL, fontWeight: '200'}}>
                                          {val.category}
                                        </Text>
                                      </View>

                                    </View>
                                  </TouchableOpacity>)
                                })
                              }
                            </ScrollView>
                          )
                        }
                      </Animated.View>
                    )
                  }
                }


                const styles = StyleSheet.create({
                  listContainer: {
                    position: 'absolute',
                    width: ScreenWidth - 20,
                    height: '100%',
                    left: 0,
                    zIndex: 15,

                    // borderRadius: 1,
                    // borderColor: 'black',
                    // position: 'absolute',
                    // height: 300,
                    // width: ScreenWidth - 20,

                    // borderTopWidth: 0.5,
                    // backgroundColor: '#444'
                  },
                  listItem: {
                    flexDirection: 'row',
                    borderBottomWidth: 0.5,
                    borderColor: '#aaa',
                    height: ScreenHeight * 0.09,
                    justifyContent: 'flex-start',
                    alignItems: 'stretch',
                  },
                  Image: {
                    height: '100%',
                    width: ScreenHeight * 0.09,
                    borderRightWidth: 0.5,
                  },
                  listItemDetails: {
                    // paddingHorizontal: 10,
                    marginHorizontal: 10,
                    paddingVertical: 5,
                    justifyContent: 'space-around',
                    alignItems: 'flex-start'
                  },
                  listWindow: Platform.OS === 'IOS'
                  ? {
                    backgroundColor: '#eee',
                    position: 'absolute',
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    width: '100%',
                    height: 0.425 * ScreenHeight ,
                    left: - ScreenWidth + 20,
                    top: 0.05 * ScreenHeight,
                    borderColor: '#eee',
                    bottom: 25,
                    zIndex: 5,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 1,
                      height: 1
                    },
                    shadowRadius: 3,
                    shadowOpacity: 0.2,
                  }
                  : {
                    backgroundColor: '#eee',
                    position: 'absolute',
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    width: '100%',
                    height: 0.425 * ScreenHeight ,
                    left: - ScreenWidth + 20,
                    top: 0.05 * ScreenHeight,
                    borderColor: '#eee',
                    bottom: 25,
                    zIndex: 5,
                  }
                  ,
                  listWindowDrag: {
                    position: 'absolute',
                    right: 0,
                    height: '100%',
                    width: 20,
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    zIndex: 1,
                    // shadowColor: '#000',
                    // shadowRadius: 3,
                    // shadowOpacity: 0.4,
                    // shadowOffset: {
                    //   width: -1,
                    //   height: 0,
                    // },
                  },
                  listWindowDragLine: {
                    height: '40%',
                    width: 3,
                    backgroundColor: '#eee',
                    borderRadius: 2,
                    left: 9,
                    top: '30%',

                  },
                  sponsorHeader: {
                    height: ScreenHeight * 0.04,
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0.8,
                    // shadowColor: '#000',
                    // shadowRadius: 3,
                    // shadowOpacity: 0.3,
                    // shadowOffset: {
                    //   width: 0,
                    //   height: 2,
                    // },
                  },
                });



                mapStateToProps = (state) => {
                  return {

                    themeColor: state.themeColor,
                  }
                }


                export default connect(mapStateToProps)(NearbyLocationsList)
