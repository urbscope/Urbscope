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
import {getUserID, getVisitedLocations} from "../utils/localStorageAPI";


import { connect } from 'react-redux';
import {fetchLandmarksFromServer, formatLocation} from "../utils/helpers";
import {Location, Permissions} from "expo";
import {setHasVisitedFalse } from "../actions";

const RatingImages = {
    starFilled: require('../assets/starFilled.png'),
    starEmpty: require('../assets/starEmpty.png')
}

class Recommendations extends Component {

    state = {
        loading: true,
        userID: null,
        recommendedPlaces: {},
         visitedPlaces: {},//[
        //     {
        //         name: 'Badshahi Mosque',
        //         id: '2231',
        //         picture: 'http://www.discoveryair.pk/wp-content/uploads/2017/06/Badshahi-Mosque-Front-1024x472.jpg',
        //         description: 'The King-y mosque',
        //         rating: 5.0
        //     },
        //     {
        //         name: 'Baap',
        //         id: '23sdx1',
        //         picture: 'https://res.cloudinary.com/teepublic/image/private/s--32LFf8OQ--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_ffffff,e_outline:35/co_ffffff,e_outline:inner_fill:35/co_ffffff,e_outline:35/co_ffffff,e_outline:inner_fill:35/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1489962884/production/designs/1335911_1.jpg',
        //         description: 'The best baap: Daddy',
        //         rating: 0.9
        //     },
        // ]
    }

    ratingEntered = (rating, index) => {
        console.log('rating', rating);
        console.log('index', index);

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
        let prom1 = this._getLocationAsync().then((location)=>{
            let url = "https://urbserver.herokuapp.com/recommend/"
                + userID
                + "?inLL=" + formatLocation(location, false);
            console.log(url);
            fetchLandmarksFromServer(url).then((landmarks)=>{
                this.setState({recommendedPlaces: landmarks});
            })
        });

        let prom2 =  this.loadVisitedLocations();
        await Promise.all([prom1,prom2]);

        this.setState({
            loading: false,
            userID: userID,
        });
    }

    loadVisitedLocations = ()=>{
        getVisitedLocations().then((visited)=>{
            console.log("visited places", visited);
            this.setState({visitedPlaces:visited});
        })

    };

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
                                        visitedPlacesValues.map((item, index) => (
                                            <View key = {item.key} style = {[styles.visitedPlacesListItem, {borderColor: themeColor}]}>
                                                <Image
                                                    source={{uri: item.picture}}
                                                    style={[styles.visitedPlacesListItemImage, {borderColor: themeColor}]}
                                                />
                                                <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-around'}}>
                                                    <Text style={[styles.visitedPlacesListItemHeading, {color: themeColor}]}>{item.name}</Text>
                                                    <Text style={styles.visitedPlacesListItemDescription}>{item.category}</Text>

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
                            recommendedPlacesValues.map((item, index) => (
                                <View key = {item.key} style = {[styles.recommendedPlacesListItem, {borderColor: themeColor}]}>
                                    <Image
                                        source={{uri: item.picture}}
                                        style={[styles.visitedPlacesListItemImage, {borderColor: themeColor}]}
                                    />
                                    <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'space-around'}}>
                                        <Text style={[styles.recommendedPlacesListItemHeading, {color: themeColor}]}>{item.name}</Text>
                                        <Text style={styles.recommendedPlacesListItemDescription}>{item.category}</Text>

                                        <View style={styles.recommendedPlacesListItemRating}>
                                            <Rating
                                                onChange={rating => {
                                                    this.ratingEntered(rating, index)
                                                }}
                                                selectedStar={RatingImages.starFilled}
                                                unselectedStar={RatingImages.starEmpty}
                                                initial={0}
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
                                                                  params: {recommendedLocation: item}
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
        hasVisitedIsChanged: state.hasVisitedIsChanged
    }
}

mapDispatchToProps = (dispatch, { navigation }) => {
    return {
        setHasVisitedFalse: () => dispatch(setHasVisitedFalse()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Recommendations)
