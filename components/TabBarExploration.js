import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';


const ScreenWidth = Dimensions.get('window').width;
// const deviceHeight = Dimensions.get('window').height;



class TabBarExploration extends React.Component{

  render() {

    const { navigation, jumpToIndex, themeColor } = this.props;



    const { routes } = this.props.navigationState;
    let navState = this.props.navigationState;


    const barWidth = ScreenWidth;
    const tabWidth = barWidth / routes.length;

    let activeTintColor   = themeColor;
    let inactiveTintColor = '#eee';

    // console.log(this.props);
    return (
      <View style={[styles.tabBar, {width: barWidth, left: ScreenWidth*0}]}>

        <View style={styles.tab}>
          <TouchableOpacity
            style={{flex: 1, justifyContent: 'center'}}
            onPress={() => {
              jumpToIndex(0)
            }}
          >
            <View style={{justifyContent:'center', alignItems: 'center'}}>

              <FontAwesome
                name={navState.index === 0 ? 'circle' : 'circle-thin' }
                size={7}
                color={navState.index === 0 ? activeTintColor : inactiveTintColor}
                style={{padding: 0}}
              />
              <Text style={navState.index === 0
                  ? {fontSize: 12, paddingTop: 3, fontWeight: '300', color: activeTintColor}
                  : {fontSize: 12, paddingTop: 3, fontWeight: '300', color: inactiveTintColor}
              }>
                Explore
              </Text>

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

              <FontAwesome
                name={navState.index === 0 ? 'circle-thin' : 'circle'}
                size={7}
                color={navState.index === 0 ? inactiveTintColor : activeTintColor}
                style={{padding: 0}}
              />
              <Text style={navState.index === 0
                  ? {fontSize: 12, paddingTop: 3, fontWeight: '300', color: inactiveTintColor}
                  : {fontSize: 12, paddingTop: 3, fontWeight: '300', color: activeTintColor}
              }>
                Recommendations
              </Text>

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
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.2)'
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
