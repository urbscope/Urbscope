import React, { Component } from 'react'
import { View,
         Text,
         StyleSheet,
         TouchableOpacity,
         ScrollView,
         Dimensions,
         Modal } from 'react-native'

import { purple, white } from '../utils/colors'

const { width } = Dimensions.get('window');

class LandmarkDetailsModal extends Component {

  // In ScrollView
  // snapToInterval={width - 60}
  // snapToAlignment={"center"}

  render(){
    console.log(this.props);
    let locations = this.props.locations

    if (locations.length === 0 ) {
      locations = [{description: "There was a problem with loading that!"}]
    }

    // if (this.props.visible && locations.length !== 0 ) {
    if (this.props.visible ) {
      return(
        <View style={styles.container}>

          <ScrollView
            ref={(scrollView) => { this.scrollView = scrollView}}
            horizontal= {true}
            decelerationRate={0}
            showsHorizontalScrollIndicator={false}
            style={styles.scroll}
          >

            {locations.map(item => (
              <View style={locations.length === 1
                            ? styles.childViewSingle
                            : styles.childView}
                    key={item.description}
              >
                <Text>{item.description}</Text>
              </View>
            ))}

            <View style={{width: 20}} />

          </ScrollView>


        </View>
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
    height: '86%',
    width: '90%',
    top: '10%',
    zIndex: 1,
    borderColor: white,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    // paddingVertical: 10,
  },
  scroll: {
    // flexGrow: 1,
    // flexDirection: 'row',
    // backgroundColor: 'gray',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  commonView: {
    padding: 20,

  },
  childView: {
    marginTop: 100,
    backgroundColor: '#eee',
    width: width - 100,
    // margin: 10,
    marginRight: 20,
    borderColor: '#ddd',
    shadowColor: '#444',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    padding: 15,
  },
  childViewSingle: {
    marginTop: 100,
    backgroundColor: '#eee',
    width: width - 80,
    // margin: 10,
    // marginRight: 1,
    borderColor: '#ddd',
    shadowColor: '#444',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    padding: 15,
  },
  view2: {
    marginTop: 100,
    backgroundColor: 'red',
    width: width - 80,
    margin: 10,
    height: 200,
    borderRadius: 10,
    //paddingHorizontal : 30
  },
})
