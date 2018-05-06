import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';


const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const FONT_SIZE_SMALL = ScreenHeight*0.016

class TabBarExploration extends React.Component{

  hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

  render() {

    const { navigation, jumpToIndex, themeColor } = this.props;

    const { routes } = this.props.navigationState;
    let navState = this.props.navigationState;

    let themeColorRGBA
    let color = this.hexToRgb(themeColor);

    if (color) {
      themeColorRGBA = `rgba(${color.r},${color.g},${color.b},0.5)`
    } else {
      themeColorRGBA = `rgba(0,0,0,0.5)`
    }

    const barWidth = ScreenWidth;
    const tabWidth = barWidth / routes.length;

    let activeTintColor   = '#fff';
    let inactiveTintColor = '#777';

    // console.log(this.props);
    return (
      <View style={[styles.tabBar, {width: barWidth, left: 0, backgroundColor: themeColorRGBA}]}>

        <View style={styles.tab}>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center'}}
            onPress={() => {
              jumpToIndex(0)
            }}
          >
            <View style={{justifyContent:'center', alignItems: 'center'}}>

              <Text style={navState.index === 0
                  ? {fontSize: FONT_SIZE_SMALL, paddingBottom: 5, fontWeight: '200', color: activeTintColor}
                  : {fontSize: FONT_SIZE_SMALL, paddingBottom: 5, fontWeight: '200', color: inactiveTintColor}
                }>
                Explore
              </Text>
              <FontAwesome
                name={navState.index === 0 ? 'circle' : 'circle-thin' }
                size={7}
                color={navState.index === 0 ? activeTintColor : inactiveTintColor}
                style={{padding: 0}}
              />

            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.tab}>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center'}}
            onPress={() => {
                jumpToIndex(1)
            }}
          >
            <View style={{justifyContent:'center', alignItems: 'center'}}>

              <Text style={navState.index === 0
                  ? {fontSize: FONT_SIZE_SMALL, paddingBottom: 5, fontWeight: '200', color: inactiveTintColor}
                  : {fontSize: FONT_SIZE_SMALL, paddingBottom: 5, fontWeight: '200', color: activeTintColor}
              }>
                Recommendations
              </Text>
              <FontAwesome
                name={navState.index === 0 ? 'circle-thin' : 'circle'}
                size={7}
                color={navState.index === 0 ? inactiveTintColor : activeTintColor}
                style={{padding: 0}}
                />

            </View>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}



const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom:0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    height: ScreenHeight * 0.05,
    // backgroundColor: 'rgba(0,0,0,0.15)'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItems: {

  },
  inactiveTintColor: {
    backgroundColor: 'rgb(0,0,255)',
  }
});

mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}

export default connect(mapStateToProps)(TabBarExploration);
