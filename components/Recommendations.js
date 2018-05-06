import React, { Component } from 'react'
import { View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Easing,
  StatusBar,
  FlatList,
  Dimensions,
  Platform,
  SafeAreaView,
  LayoutAnimation } from 'react-native'

import Rating from 'react-native-rating'

import { NavigationActions } from 'react-navigation';


// import ChangeModeSwitch from './ChangeModeSwitch'

import Settings from './Settings'
import Loading from './Loading'

import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import {getUserID, getVisitedLocations} from "../utils/localStorageAPI";

import {red, blue, green, yellow, black} from '../utils/colors';
import { connect } from 'react-redux';
import {fetchLandmarksFromServer, formatLocation} from "../utils/helpers";
import {Location, Permissions} from "expo";
import {setHasVisitedFalse } from "../actions";

const RatingImages = {
  starFilledred: require('../assets/starFilledred.png'),
  starEmptyred: require('../assets/starEmptyred.png'),
  starFilledgreen: require('../assets/starFilledgreen.png'),
  starEmptygreen: require('../assets/starEmptygreen.png'),
  starFilledblue: require('../assets/starFilledblue.png'),
  starEmptyblue: require('../assets/starEmptyblue.png'),
  starFilledyellow: require('../assets/starFilledyellow.png'),
  starEmptyyellow: require('../assets/starEmptyyellow.png'),
  starFilledblack: require('../assets/starFilledblack.png'),
  starEmptyblack: require('../assets/starEmptyblack.png'),

}

const ScreenHeight = Dimensions.get('window').height
const ScreenWidth  = Dimensions.get('window').width

const FONT_SIZE_SMALLER = ScreenHeight * 0.015
const FONT_SIZE_SMALL   = ScreenHeight * 0.0175
const FONT_SIZE_MEDIUM  = ScreenHeight * 0.021
const FONT_SIZE_LARGE   = ScreenHeight * 0.025
const FONT_SIZE_LARGER  = ScreenHeight * 0.027
const FONT_SIZE_LARGEST = ScreenHeight * 0.034

class Recommendations extends Component {

  state = {
    loading: false,
    userID: null,
    sponsoredLocation: null,
    recommendedPlaces: [], //[
    //   {
    //       name: 'Badshahi Mosque',
    //       id: '2231',
    //       picture: 'http://www.discoveryair.pk/wp-content/uploads/2017/06/Badshahi-Mosque-Front-1024x472.jpg',
    //       category: 'Mosques',
    //       address: 'The King-y mosque',
    //       rating: 5.0
    //   },
    //   {
    //       name: 'Baap',
    //       id: '23sdx1',
    //       picture: 'https://res.cloudinary.com/teepublic/image/private/s--32LFf8OQ--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_ffffff,e_outline:35/co_ffffff,e_outline:inner_fill:35/co_ffffff,e_outline:35/co_ffffff,e_outline:inner_fill:35/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1489962884/production/designs/1335911_1.jpg',
    //       category: 'bharwi',
    //       address: 'The best baap: Daddy',
    //       rating: 0.9
    //   },
    //   {
    //       name: 'Badshahi Mosque',
    //       id: '2231',
    //       picture: 'http://www.discoveryair.pk/wp-content/uploads/2017/06/Badshahi-Mosque-Front-1024x472.jpg',
    //       address: 'The King-y mosque',
    //       category: 'Historic',
    //       rating: 5.0
    //   },
    //   {
    //       name: 'Baap',
    //       id: '23sdx1',
    //       picture: 'https://res.cloudinary.com/teepublic/image/private/s--32LFf8OQ--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_ffffff,e_outline:35/co_ffffff,e_outline:inner_fill:35/co_ffffff,e_outline:35/co_ffffff,e_outline:inner_fill:35/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1489962884/production/designs/1335911_1.jpg',
    //       category: 'Concerts',
    //       address: 'The best baap: Daddy',
    //       rating: 0.9
    //   },
    //   {
    //       name: 'Badshahi Mosque',
    //       id: '2231',
    //       picture: 'http://www.discoveryair.pk/wp-content/uploads/2017/06/Badshahi-Mosque-Front-1024x472.jpg',
    //       category: 'Religious',
    //       address: 'The King-y mosque',
    //       rating: 5.0
    //   },
    //   {
    //       name: 'Baap',
    //       id: '23sdx1',
    //       picture: 'https://res.cloudinary.com/teepublic/image/private/s--32LFf8OQ--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_ffffff,e_outline:35/co_ffffff,e_outline:inner_fill:35/co_ffffff,e_outline:35/co_ffffff,e_outline:inner_fill:35/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1489962884/production/designs/1335911_1.jpg',
    //       address: 'The best baap: Daddy',
    //       category: 'bharwi',
    //       rating: 0.9
    //   },
    // ],
    visitedPlaces: [] //[
      //     {
      //         name: 'Badshahi Mosque',
      //         id: '2231',
      //         picture: 'http://www.discoveryair.pk/wp-content/uploads/2017/06/Badshahi-Mosque-Front-1024x472.jpg',
      //         address: 'The King-y mosque',
      //         category: 'Coffee and Stuff',
      //         rating: 5.0
      //     },
      //     {
      //         name: 'Baap',
      //         id: '23sdx1',
      //         picture: 'https://res.cloudinary.com/teepublic/image/private/s--32LFf8OQ--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_ffffff,e_outline:35/co_ffffff,e_outline:inner_fill:35/co_ffffff,e_outline:35/co_ffffff,e_outline:inner_fill:35/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1489962884/production/designs/1335911_1.jpg',
      //         address: 'The best baap: Daddy',
      //         category: 'bharwi',
      //         rating: 0.9
      //     },
      // ]
    }

    ratingEntered = (rating, index) => {
      console.log('rating', rating);
      console.log('index', index);

      var temp = this.state.visitedPlaces
      delete temp[index];

      setTimeout(() => {
        LayoutAnimation.linear();
        this.setState({
          visitedPlaces: temp,
        })
      }, 1000)
    }

    // UNSAFE_componentWillReceiveProps(nextProps){
    //     console.log("Recommendation:UNSAFE_componentWillReceiveProps");
    //     if (nextProps.hasVisitedIsChanged){
    //         this.loadVisitedLocations();
    //         this.props.setHasVisitedFalse();
    //
    //
    //
    //     }
    // }


    componentDidUpdate(nextProps, prevState) {
      console.log("Recommendation:componentDidUpdate");
      if (nextProps.hasVisitedIsChanged) {
        this.loadVisitedLocations();
      }
      nextProps.setHasVisitedFalse();
    }


    async componentDidMount () {
      LayoutAnimation.linear();
      console.log("Recommendations:componentDidMount");
      let userID = await getUserID();

      // THIS WAITS FOR THE VISITED PLACES
      let visitedPlaces = await getVisitedLocations()
      console.log('visited', visitedPlaces);

      this._getLocationAsync().then((location) => {
        let url = "https://urbserver.herokuapp.com/recommend/"
        + userID
        + "?inLL=" + formatLocation(location, false);
        console.log(url);
        fetchLandmarksFromServer(url).then( (res) => {
          // THIS IS WHERE EVERYTHING IS SET IN THE STATE AT ONCE
          this.setState({
            recommendedPlaces: res[0],
            sponsoredLocation: res[1],
            loading: false,
            visitedPlaces,
            userID,
          });
        })
      });

    }

    // loadVisitedLocations = ()=>{

      // getVisitedLocations().then((visited)=>{
      //   console.log("visited places", visited);
      //   this.setState({visitedPlaces:visited});
      // })

    // };

    //THIS IS COPIED FROM NEARBY LOCATIONS. CONSIDER COMBINING
    _getLocationAsync = async () => {
      let {status} = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        this.setState({
          errorMessage: 'Permission to access location was denied',
        });
      }

      let location = await Location.getCurrentPositionAsync({});
      this.setState({location});
      return location;
    };

    render(){
      const { navigation, themeColor } = this.props;


      const { settingVisible, loading, visitedPlaces, recommendedPlaces } = this.state;
      const recommendedPlacesValues = recommendedPlaces?Object.values(recommendedPlaces):[];
      const visitedPlacesValues = visitedPlaces?Object.values(visitedPlaces):[];

      //console.log(recommendedPlaces);

      let starFilled
      let starEmpty

      switch (themeColor) {
        case red:
          starFilled = RatingImages.starFilledred
          starEmpty = RatingImages.starEmptyred
          break;

        case green:
          starFilled = RatingImages.starFilledgreen
          starEmpty = RatingImages.starEmptygreen
          break;

        case blue:
          starFilled = RatingImages.starFilledblue
          starEmpty = RatingImages.starEmptyblue
          break;

        case yellow:
          starFilled = RatingImages.starFilledyellow
          starEmpty = RatingImages.starEmptyyellow
          break;

        case black:
          starFilled = RatingImages.starFilledblack
          starEmpty = RatingImages.starEmptyblack
          break;

        default:
      }


      if (loading) {
        return(
          <View style={ {flex: 1, backgroundColor: {themeColor}} }>
            <Loading loading={this.state.loading} />
          </View>
        )
      } else {

        return (

            <SafeAreaView style={[styles.container, {backgroundColor: themeColor}]}>


            <StatusBar barStyle="light-content" translucent={true}/>

            <View style={{backgroundColor: '#eee', flex: 1}}>

              {(!visitedPlaces || Object.keys(visitedPlaces).length === 0)
                ? <View></View>
                : (
                  <View >

                    <View style={{padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColor}}>
                      <Text style={{color: '#eee', fontSize: FONT_SIZE_LARGEST, fontWeight: '200'}}>
                        Visited Placed
                      </Text>
                    </View>
                    <View style={[styles.header, {backgroundColor: themeColor}]}>
                      <Text style={{color: '#eee', fontSize: FONT_SIZE_SMALLER, fontWeight: '200'}}>
                        For better recommendations, rate the palces you've visited.
                      </Text>
                    </View>

                    <ScrollView
                      style={[styles.visitedPlacesList, {borderColor: themeColor}]}
                      >
                      {
                        visitedPlacesValues.map((item, index) => (
                          <View key={item.key} style={(index === visitedPlacesValues.length - 1)
                              ? [styles.visitedPlacesListItem, {borderBottomWidth: 0}]
                              : [styles.visitedPlacesListItem, {borderColor: '#aaa'}]}
                            >
                            <Image
                              source={{uri: item.picture}}
                              style={styles.visitedPlacesListItemImage}
                            />
                            <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-around', paddingLeft: 10, paddingVertical: 5,}}>
                              <Text style={{fontSize: FONT_SIZE_MEDIUM, fontWeight: '200'}}>
                                {item.name}
                              </Text>
                              <Text style={{fontSize: FONT_SIZE_SMALL, color: themeColor, fontWeight: '200'}}>
                                {item.category}
                              </Text>

                              <View style={styles.visitedPlacesListItemRating}>
                                <Rating
                                  onChange={rating => {
                                    this.ratingEntered(rating, item.key)
                                  }}
                                  selectedStar={RatingImages.starFilledred}
                                  unselectedStar={starEmpty}
                                  initial={0}
                                  editable={true}
                                  config={{
                                    easing: Easing.inOut(Easing.ease),
                                    duration: 350
                                  }}
                                  stagger={50}
                                  maxScale={1.4}
                                  starStyle={{
                                    width: ScreenHeight * 0.026,
                                    height: ScreenHeight * 0.026,
                                    marginRight: ScreenHeight * 0.003,
                                    opacity: 0.7
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



              <View style={[styles.header, {backgroundColor: themeColor}]}>
                <Text style={{color: '#eee', fontSize: FONT_SIZE_LARGEST, fontWeight: '200'}}>
                  Recommendations
                </Text>
              </View>

              <ScrollView
                style={[styles.recommendedPlacesList, {borderColor: themeColor}]}
                >
                {
                  recommendedPlacesValues.map((item, index) => (
                    <View key={item.key} style={(index === recommendedPlacesValues.length - 1)
                        ? [styles.recommendedPlacesListItem, {borderBottomWidth: 0}]
                        : [styles.recommendedPlacesListItem, {borderColor: '#aaa'}]}
                      >
                      <Image
                        source={{uri: item.picture}}
                        style={styles.recommendedPlacesListItemImage}
                        />
                      <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-around', paddingLeft: 10, paddingVertical: 5,}}>
                        <Text style={{fontSize: FONT_SIZE_MEDIUM, fontWeight: '200'}}>
                          {item.name}
                        </Text>
                        <Text style={{fontSize: FONT_SIZE_SMALL, color: themeColor, fontWeight: '200'}}>
                          {item.category}
                        </Text>

                        <View style={styles.recommendedPlacesListItemRating}>
                          <Rating
                            selectedStar={starFilled}
                            unselectedStar={starEmpty}
                            initial={item.rating}
                            editable={false}
                            config={{
                              easing: Easing.inOut(Easing.ease),
                              duration: 350
                            }}
                            stagger={50}
                            maxScale={1.4}
                            starStyle={{
                              width: ScreenHeight * 0.026,
                              height: ScreenHeight * 0.026,
                              marginRight: ScreenHeight * 0.003,
                              opacity: 0.7
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
                              params: {recommendedLocation: item}
                            })],
                          }))

                        }}
                        >
                        <MaterialIcons
                          name='navigation'
                          size={ScreenHeight * 0.028}
                          color={'#eee'}
                          />
                      </TouchableOpacity>
                    </View>
                  ))
                }
              </ScrollView>

            </View>

            <View style={{paddingTop: 6.75, backgroundColor: themeColor}}>
            </View>


          </SafeAreaView>
        )
      }
    }
  }



  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      padding: 5,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 0.5,
      shadowOffset: {
        width: 0,
        height: 1,
      }
    },
    visitedPlacesListItem: {
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      height: ScreenHeight * 0.11,
    },
    visitedPlacesListItemImage: {
      width: ScreenHeight * 0.11,
    },
    recommendedPlacesListItem: {
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      height: ScreenHeight * 0.11,
    },
    recommendedPlacesListItemImage: {
      width: ScreenHeight * 0.11,

    },
    navigateButton: {
      height: ScreenHeight * 0.05,
      width: ScreenHeight * 0.043,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      borderTopLeftRadius: ScreenHeight * 0.025,
      borderBottomLeftRadius: ScreenHeight * 0.025,
    }
  })


  mapStateToProps = (state) => {
    return {
      settings: state.settings,
      themeColor: state.themeColor,
      hasVisitedIsChanged: state.hasVisitedIsChanged
    }
  }

  mapDispatchToProps = (dispatch, { navigation }) => {
    return {
      setHasVisitedFalse: () => dispatch(setHasVisitedFalse()),
    }
  }

  export default connect(mapStateToProps, mapDispatchToProps)(Recommendations)
