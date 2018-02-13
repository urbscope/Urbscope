import React from 'react'
import { View,
         StyleSheet,
         Text,
         ScrollView,
         Slider,
         PickerIOS,
         Dimensions } from 'react-native'

import { red } from '../utils/colors'

var ScreenWidth = Dimensions.get('window').width
var ScreenHeight = Dimensions.get('window').height

class Settings extends React.Component {

  state = {
    dectionLimit: 5,
    nearbyLimit: 10,
    nearbyRadius: 1000,
    category: 'religious',
  }

  render () {
    const { dectionLimit, nearbyRadius, category, nearbyLimit } = this.state

    if (this.props.visible) {
      return (
        <View style={styles.container}>
          <View style={styles.heading}>
            <Text style={styles.headingText}>Settings</Text>
          </View>

          <ScrollView
            style={{flex: 1}}
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
            <Text style={{fontSize: 12, fontStyle: 'italic', textAlign: 'center'}}>
              Maximum number of landmark that can be detected in Detection Mode.
            </Text>
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
              <Text style={{fontSize: 12, fontStyle: 'italic', textAlign: 'center'}}>
                Maximum number of landmark that are displayed in Nearby Location mode.
              </Text>

            </View>

            {/* Category */}
            <View style={styles.item}>
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
              <Text style={{fontSize: 12, fontStyle: 'italic', textAlign: 'center'}}>
                The landmarks from selected category will be displayed in Nearby Location mode.
              </Text>

            </View>

            {/*Nearby Location Limit */}
            <View style={styles.itemLast}>
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

              <Text style={{fontSize: 12, fontStyle: 'italic', textAlign: 'center'}}>
                Maximum number of landmark that are displayed in Nearby Location mode.
              </Text>

            </View>

          </ScrollView>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }
}

export default Settings

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
    height: ScreenHeight * 60 / 100,
    width: ScreenWidth * 80 / 100,
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

  },
  headingText: {
    fontSize: 25,
    color: red,
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
