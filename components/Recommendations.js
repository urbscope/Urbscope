import React, { Component } from 'react'
import { View,
         Text,
         StyleSheet,
         TouchableOpacity,
         ScrollView,
         Image,
         Easing,
         FlatList,
         LayoutAnimation } from 'react-native'

import Rating from 'react-native-rating'

import { NavigationActions } from 'react-navigation';


import ChangeModeSwitch from './ChangeModeSwitch'
import ExplorationModeSwitch from './ExplorationModeSwitch'
import Settings from './Settings'
import Loading from './Loading'

import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';


import { connect } from 'react-redux';

const RatingImages = {
  starFilled: require('../assets/starFilled.png'),
  starEmpty: require('../assets/starEmpty.png')
}

class Recommendations extends Component {

  state = {
    settingVisible: false,
    loading: false,
    recommendedPlaces: [
      {
        name: 'Taj Mahal',
        id: '1',
        thumbnail: 'https://www.telegraph.co.uk/content/dam/Travel/leadAssets/24/92/taj-pinl_2492833a.jpg?imwidth=1400',
        description: 'The best mahal made by Shah Jahan',
        rating: 4.5
      },
      {
        name: 'Eiffel Tower',
        id: '231',
        thumbnail: 'https://amp.thisisinsider.com/images/58d919eaf2d0331b008b4bbd-750-562.jpg',
        description: 'The best tower made by French',
        rating: 4.8
      },
      {
        name: 'Pyramids',
        id: '2321',
        thumbnail: 'https://i.kinja-img.com/gawker-media/image/upload/s--eq6ppCkp--/c_scale,fl_progressive,q_80,w_800/kmjs3kohtxp7eal972f2.jpg',
        description: 'The best triangles. made by Egyptians',
        rating: 3.9
      },
      {
        name: 'Pyramids',
        id: '2321',
        thumbnail: 'https://i.kinja-img.com/gawker-media/image/upload/s--eq6ppCkp--/c_scale,fl_progressive,q_80,w_800/kmjs3kohtxp7eal972f2.jpg',
        description: 'The best triangles. made by Egyptians',
        rating: 3.9
      },
      {
        name: 'Pyramids',
        id: '2321',
        thumbnail: 'https://i.kinja-img.com/gawker-media/image/upload/s--eq6ppCkp--/c_scale,fl_progressive,q_80,w_800/kmjs3kohtxp7eal972f2.jpg',
        description: 'The best triangles. made by Egyptians',
        rating: 3.9
      },
    ],
    visitedPlaces: [
      {
        name: 'Badshahi Mosque',
        id: '2231',
        thumbnail: 'http://www.discoveryair.pk/wp-content/uploads/2017/06/Badshahi-Mosque-Front-1024x472.jpg',
        description: 'The King-y mosque',
        rating: 5.0
      },
      {
        name: 'Baap',
        id: '23sdx1',
        thumbnail: 'https://res.cloudinary.com/teepublic/image/private/s--32LFf8OQ--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_ffffff,e_outline:35/co_ffffff,e_outline:inner_fill:35/co_ffffff,e_outline:35/co_ffffff,e_outline:inner_fill:35/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1489962884/production/designs/1335911_1.jpg',
        description: 'The best baap: Daddy',
        rating: 0.9
      },
    ]
  }

  ratingEntered = (rating, index) => {
    console.log('rating', rating);
    console.log('index', index);

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

  const { settingVisible, loading, visitedPlaces, recommendedPlaces } = this.state

  if (loading) {
    return(
      <View style={ {flex: 1, backgroundColor: '#444'} }>
        <Loading loading={this.state.loading} />
      </View>
    )
  } else {

    return (
      <View style={styles.container}>

        {/*
        <ExplorationModeSwitch
          currentScreen={navigation.state.routeName}
          changeScreen={navigation.navigate}
          dispatch={navigation.dispatch}
        />


         <ChangeModeSwitch
          replaceScreen={navigation.replace}
          currentScreen={navigation.state.routeName}
          changeScreen={navigation.navigate}
          dispatch={navigation.dispatch}
        />

      */}



      {visitedPlaces.length === 0
        ? <View></View>
        : (<View>

            <View style={{padding: 10, justifyContent: 'center', alignItems: 'center', borderColor: themeColor, borderBottomWidth: 0.5}}>
              <Text style={{color: themeColor, fontSize: 25, fontWeight: '200'}}>
                  Visited Placed
                </Text>
              </View>
              <View style={{padding: 5, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: themeColor, fontSize: 12, fontWeight: '200'}}>
                  For better recommendations, rate the palces you've visited.
                </Text>
              </View>

              <ScrollView
                style={[styles.visitedPlacesList, {borderColor: themeColor}]}
              >
                {
                  visitedPlaces.map((item, index) => (
                    <View key = {item.id} style = {[styles.visitedPlacesListItem, {borderColor: themeColor}]}>
                      <Image
                        source={{uri: item.thumbnail}}
                        style={[styles.visitedPlacesListItemImage, {borderColor: themeColor}]}
                      />
                    <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-around'}}>
                        <Text style={[styles.visitedPlacesListItemHeading, {color: themeColor}]}>{item.name}</Text>
                        <Text style={styles.visitedPlacesListItemDescription}>{item.description}</Text>

                        <View style={styles.visitedPlacesListItemRating}>
                          <Rating
                            onChange={rating => {
                              this.ratingEntered(rating, index)
                            }}
                            selectedStar={RatingImages.starFilled}
                            unselectedStar={RatingImages.starEmpty}
                            initial={item.rating}
                            editable={true}
                            config={{
                              easing: Easing.inOut(Easing.ease),
                              duration: 350
                            }}
                            stagger={50}
                            maxScale={1.4}
                            starStyle={{
                              width: 25,
                              height: 25,
                              opacity: 0.8
                            }}
                            />
                        </View>

                      </View>
                    </View>
                  ))
                }
              </ScrollView>
            </View>
          )
      }



        <View style={{padding: 10, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: themeColor, fontSize: 25, fontWeight: '200'}}>
            Recommendations
          </Text>
        </View>

        <ScrollView
          style={[styles.recommendedPlacesList, {borderColor: themeColor}]}
        >
        {
          recommendedPlaces.map((item, index) => (
            <View key = {item.id} style = {[styles.recommendedPlacesListItem, {borderColor: themeColor}]}>
              <Image
                source={{uri: item.thumbnail}}
                style={[styles.visitedPlacesListItemImage, {borderColor: themeColor}]}
              />
              <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-around'}}>
                <Text style={[styles.recommendedPlacesListItemHeading, {color: themeColor}]}>{item.name}</Text>
                <Text style={styles.recommendedPlacesListItemDescription}>{item.description}</Text>

                <View style={styles.recommendedPlacesListItemRating}>
                <Rating
                  onChange={rating => {
                    this.ratingEntered(rating, index)
                  }}
                  selectedStar={RatingImages.starFilled}
                  unselectedStar={RatingImages.starEmpty}
                  initial={item.rating}
                  editable={false}
                  config={{
                    easing: Easing.inOut(Easing.ease),
                    duration: 350
                  }}
                  stagger={50}
                  maxScale={1.4}
                  starStyle={{
                    width: 25,
                    height: 25,
                    opacity: 0.8
                  }}
                  />
                </View>

              </View>

              <TouchableOpacity style={[styles.navigateButton, {backgroundColor: themeColor}]}
                onPress={() => {
                  this.props.navigation.dispatch(NavigationActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({
                      routeName: 'ExplorationMode',
                      params: {location: 'sdasda'}
                    })],
                  }))

                }}
              >
                <MaterialIcons
                  name='navigation'
                  size={25}
                  color={'#eee'}
                  />
              </TouchableOpacity>
            </View>
          ))
        }
        </ScrollView>

{/*
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
*/}


          <View style={{padding: 13, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.5)'}}>
            <Text style={{}}>

            </Text>
          </View>

        </View>
      )
    }
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed'
  },
  buttonSettings: {
    position: 'absolute',
    zIndex: 11,
    top: 15,
    right: 15,
    height: 60,
    width: 58,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
  },
  visitedPlacesList: {
    borderTopWidth: 0.5,
  },
  visitedPlacesListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    height:  100,

  },
  visitedPlacesListItemHeading: {
    fontSize: 20,
    fontWeight: '600',
    paddingLeft: 10,
    paddingTop: 5,
  },
  visitedPlacesListItemDescription: {
    fontSize: 12,
    fontWeight: '200',
    // alignSelf: 'center',
    paddingLeft: 10,
    paddingBottom: 10,
  },
  visitedPlacesListItemRating: {

    paddingLeft: 10,
    paddingBottom: 10,
  },
  visitedPlacesListItemImage: {
    height: 99,
    width: 100,
    borderRightWidth: 0.5,
    padding: 5,
  },
  recommendedPlacesList: {
    borderTopWidth: 0.5,
  },
  recommendedPlacesListItem: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    height:  100,
  },
  recommendedPlacesListItemHeading: {
    fontSize: 20,
    fontWeight: '600',
    paddingLeft: 10,
    paddingTop: 5,
  },
  recommendedPlacesListItemDescription: {
    fontSize: 12,
    fontWeight: '200',
    // alignSelf: 'center',
    paddingLeft: 10,
    paddingBottom: 10,
  },
  recommendedPlacesListItemRating: {

    paddingLeft: 10,
    paddingBottom: 10,
  },
  recommendedPlacesListItemImage: {
    height: '100%',
    width: 100,
    borderRightWidth: 0.5,
  },
  navigateButton: {
    height: 45,
    width: 35,
    // paddingRight: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,

  }
})


mapStateToProps = (state) => {
  return {
    settings: state.settings,
    themeColor: state.themeColor,
  }
}



export default connect(mapStateToProps)(Recommendations)
