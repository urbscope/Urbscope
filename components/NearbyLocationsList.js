import React, { Component } from 'react'
import { StyleSheet,
         ScrollView,
         Dimensions,
         View,
         Text,
         Image,
         Animated,
         PanResponder,
         TouchableOpacity} from "react-native"

import { connect } from 'react-redux'


const ScreenHeight = Dimensions.get('window').height
const ScreenWidth  = Dimensions.get('window').width

class NearbyLocationsList extends React.Component {


    constructor(props) {
      super(props);

      this.state = {
        listViewPosition: new Animated.ValueXY(),
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

          if (moveX < ScreenWidth * 0.4 || vx < -2) {
            Animated.spring(this.state.listViewPosition, { toValue: {x: 0, y: 0}, friction: 7, tension: 20}).start();
          }
          if (moveX > ScreenWidth * 0.4 || vx > 2) {
            Animated.spring(this.state.listViewPosition, { toValue: {x: ScreenWidth-20, y: 0}, friction: 7, tension: 20}).start();
          }
        }

      })
    }

    render() {

      const { listViewPosition } = this.state


      const { locations, themeColor, sponsoredLocation } = this.props


        let [translateX, translateY] = [listViewPosition.x, listViewPosition.y];
        let imageStyle = {transform: [{translateX}, {translateY}]};

        // let locations = this.props.locations;

        return (
          <Animated.View style={[styles.listWindow, imageStyle]} >

            <View style={[styles.listWindowDrag, {backgroundColor: themeColor}]}
            {...this._panResponder.panHandlers}>
              <View style={styles.listWindowDragLine}>
              </View>
            </View>

            <ScrollView style={styles.listContainer} >
                {sponsoredLocation
                    ? (<TouchableOpacity
                            key={sponsoredLocation.key}
                            onPress={()=>this.props.handlePress(sponsoredLocation.key)}
                        >
                            <View style={styles.listItem} >
                                {sponsoredLocation.picture
                                    ?(<Image style={styles.Image}
                                             source={{uri: sponsoredLocation.picture}}/>)
                                    :(<Image style={styles.Image}
                                             source={require('../assets/urbscope_loading.png')}/>)
                                }

                                <View>
                                    <Text>
                                        {sponsoredLocation.name}
                                    </Text>
                                    <Text>
                                        {sponsoredLocation.category}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>)
                    : null}

                {locations.map(val => {
                return (
                    <TouchableOpacity
                  key={val.key}
                  onPress={()=>this.props.handlePress(val.key)}
                >
                  <View style={styles.listItem} >
                      {val.picture
                          ?(<Image style={styles.Image}
                                   source={{uri: val.picture}}/>)
                          :(<Image style={styles.Image}
                                   source={require('../assets/urbscope_loading.png')}/>)
                      }

                    <View>
                      <Text>
                        {val.name}
                      </Text>
                      <Text>
                        {val.category}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>)
              })
            }
          </ScrollView>
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
        height:  60,
    },
    Image: {
        height: '100%',
        width: 60,
        borderRightWidth: 0.5,
    },
    listWindow: {
      backgroundColor: '#eee',
      position: 'absolute',
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      width: '100%',
      height: 0.41 * ScreenHeight ,
      left: - ScreenWidth + 20,
      top: 0.01 * ScreenHeight,
      borderColor: '#eee',
      bottom: 25,
      zIndex: 15,
      shadowColor: '#000',
      shadowOffset: {
        width: 1,
        height: 1
      },
      shadowRadius: 3,
      shadowOpacity: 0.2,

    },
    listWindowDrag: {
      position: 'absolute',
      right: 0,
      height: '100%',
      width: 20,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      zIndex: 15,
    },
    listWindowDragLine: {
      height: '40%',
      width: 3,
      backgroundColor: '#eee',
      borderRadius: 2,
      left: 9,
      top: '30%',

    },
});



mapStateToProps = (state) => {
  return {

    themeColor: state.themeColor,
  }
}


export default connect(mapStateToProps)(NearbyLocationsList)
