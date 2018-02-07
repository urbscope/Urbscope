import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native'

class LandmarkDetailsModal extends Component {



  render(){

    if (this.props.visible !== true) {
      return (
        <View/>
      )
    } else {
      return(
        <View style={styles.container}>

          <Text>Modal</Text>


        </View>
      )
    }
  }
}

export default LandmarkDetailsModal

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    position: 'absolute',
    height: '90%',
    width: '90%',
    top: '5%',
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 10,
  },
})
