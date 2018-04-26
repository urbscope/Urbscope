import React, { Component } from 'react'
import { View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation } from 'react-native'

  import ChangeModeSwitch from './ChangeModeSwitch'
  import ExplorationModeSwitch from './ExplorationModeSwitch'
  import Settings from './Settings'
  import Loading from './Loading'

  import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';


  import { connect } from 'react-redux';

  class Recommendations extends Component {
    state = {
      settingVisible: false,
      loading: false,
      recommendedPlaces: [
        {
          name: 'Taj Mahal',
          thumbnail: 'https://www.telegraph.co.uk/content/dam/Travel/leadAssets/24/92/taj-pinl_2492833a.jpg?imwidth=1400',
          description: 'The best mahal made by Shah Jahan',
          rating: 4.5
        },
        {
          name: 'Eiffel Tower',
          thumbnail: 'https://amp.thisisinsider.com/images/58d919eaf2d0331b008b4bbd-750-562.jpg',
          description: 'The best tower made by French',
          rating: 4.8
        },
        {
          name: 'Pyramids',
          thumbnail: 'https://i.kinja-img.com/gawker-media/image/upload/s--eq6ppCkp--/c_scale,fl_progressive,q_80,w_800/kmjs3kohtxp7eal972f2.jpg',
          description: 'The best triangles. made by Egyptians',
          rating: 3.9
        },
      ],
      visitedPlaces: []
    }


    closeSettings = () => {
      this.setState({settingVisible: false})
    }


    openSettings = () => {
      this.setState({settingVisible: true})
    }


    componentDidMount () {
      LayoutAnimation.linear();
      this.setState({})
    }

    render(){
      const { navigation, themeColor } = this.props

      const { settingVisible, loading } = this.state

      if (loading) {
        return(
          <View style={ {flex: 1, backgroundColor: '#444'} }>
            <Loading loading={this.state.loading} />
          </View>
        )
      } else {

        return (
          <View style={styles.container}>

            <ExplorationModeSwitch
              currentScreen={navigation.state.routeName}
              changeScreen={navigation.navigate}
              dispatch={navigation.dispatch}
              />
            <ChangeModeSwitch
              currentScreen={navigation.state.routeName}
              changeScreen={navigation.navigate}
              dispatch={navigation.dispatch}
              />



            <TouchableOpacity
              onPress={settingVisible
                ? this.closeSettings
                : this.openSettings}
                style={[styles.buttonSettings, {backgroundColor: themeColor}]}
                >
                <Ionicons
                  name='ios-settings-outline'
                  size={50}
                  color={'#fff'}
                  />
              </TouchableOpacity>

              <Settings
                visible={settingVisible}
                />

            </View>
          )
        }
      }
    }



    const styles = StyleSheet.create({
      container: {
        flex: 1
      },
      buttonSettings: {
        position: 'absolute',
        zIndex: 11,
        top: 15,
        right: 15,
        height: 60,
        width: 58,
        borderRadius: 20,
        // backgroundColor: red,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 4,
      },
    })


    mapStateToProps = (state) => {
      return {
        settings: state.settings,
        themeColor: state.themeColor,
      }
    }



    export default connect(mapStateToProps)(Recommendations)
