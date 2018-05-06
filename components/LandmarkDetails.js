import React, { Component } from 'react'
import { View,
         Text,
         StyleSheet,
         TouchableOpacity,
         ScrollView,
         Dimensions,
         Image,
         WebView,
         Linking,
         ActivityIndicator } from 'react-native'

import { cardBackground, cardButtonText } from '../utils/colors'
import { fixLandmarkDetail } from '../utils/helpers'

import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

import { connect } from 'react-redux'


import { GOOGLE_API } from '../utils/keysAPI'

import * as KnowledgeGraphAPI from '../utils/kgsAPI'


// const { width, height } = Dimensions.get('window');
var ScreenWidth = Dimensions.get('window').width
var ScreenHeight = Dimensions.get('window').height

const FONT_SIZE_SMALLER = ScreenHeight * 0.015
const FONT_SIZE_SMALL   = ScreenHeight * 0.017
const FONT_SIZE_MEDIUM  = ScreenHeight * 0.02
const FONT_SIZE_LARGE   = ScreenHeight * 0.028
const FONT_SIZE_LARGER  = ScreenHeight * 0.035
const FONT_SIZE_LARGEST = ScreenHeight * 0.034



class LandmarkDetails extends Component {
  state = {
    loading: true,
    details: {},
  }

  componentDidMount () {
    if (this.props.location.description !== 'problem'){
      KnowledgeGraphAPI.getDetailWithName(this.props.location.description)
      .then( res => {
        let details = fixLandmarkDetail(res)
        if (details) {
          this.setState({
            loading: false,
            details
          })
        } else {
          KnowledgeGraphAPI.getDetailWithID(this.props.location.mid)
            .then( res => {
              let details = fixLandmarkDetail(res)
              if (details) {
                this.setState({
                  loading: false,
                  details
                })
              }
          })
        }
      })
    }
  }

  render(){

    const { location, multiple, themeColor } = this.props
    const { loading } = this.state
    const { name, image, detailedDescription, url } = this.state.details


    if (!loading){
      return (
        <View
          style={multiple ? styles.childView : styles.childViewSingle}
        >
          <Image
            source={image
                    ? {uri: image.contentUrl}
                    : {uri: ''}}
            style={styles.landmarkImage}
          />

          <View style={styles.header}>
            <Text style={name.length > 22
                          ? { fontSize: FONT_SIZE_LARGE, color: themeColor }
                          : { fontSize: FONT_SIZE_LARGER, color: themeColor } }>{name}</Text>
          </View>


          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: ScreenHeight * 0.01,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{fontSize: FONT_SIZE_SMALL}} >
                {detailedDescription.articleBody}
            </Text>
          </ScrollView>

          <View style={styles.linksContainer}>
            <TouchableOpacity style={styles.linkButton}
              onPress={ () => Linking.openURL(detailedDescription.url) }
            >
              <FontAwesome name='wikipedia-w' size={ScreenHeight * 0.026} color={themeColor}/>
            </TouchableOpacity>

            {url &&
              <TouchableOpacity
                  style={styles.linkButton}
                  onPress={ () => Linking.openURL(url) }
              >
                <MaterialIcons name='open-in-browser' size={ScreenHeight * 0.035} color={themeColor}/>
              </TouchableOpacity>
            }
          </View>


        </View>
      )
    } else {
      return (
        <View
          style={multiple ? styles.childView : styles.childViewSingle}
          >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator
              size="large"
              color={'#555'}
              animating={this.state.loading}
              />
          </View>
        </View>
      )
    }
  }
}



const styles = StyleSheet.create({

  childView: {
    marginTop: 40,
    backgroundColor: '#eee',
    width: ScreenWidth - 100,
    // margin: 10,
    marginRight: 20,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // padding: 15,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  childViewSingle: {
    marginTop: 40,
    backgroundColor: '#eee',
    width: ScreenWidth - 80,
    // margin: 10,
    // marginRight: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // padding: 15,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    // flex: 0.3,
    height: ScreenHeight*0.06,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerltX: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    // flex: 0.3,
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landmarkName: {
    fontSize: 28,
  },
  landmarkImage: {
    // flex: 1,
    height: ScreenHeight * 0.25
  },
  landmarkImageltX: {
    // flex: 1,
    height: 130
  },
  body: {
    flex: 1,
    padding: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landmarkDetails: {
    fontSize: 15,
    textAlign: 'center',
  },
  wikipediaLink: {
    height: 40,
    // flex: 0.2,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  wikipediaLinkltX: {
    height: 35,
    // flex: 0.2,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  wikipediaLinkText: {
    fontSize: 16,
  },
  footer: {
    // flex: 0.2,
    height: 40,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerltX: {
    // flex: 0.2,
    height: 35,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  website: {
    fontSize: 16,

  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    // height: 40,
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 40,
  },
  linkButton: {
    height: ScreenHeight * 0.05,

    width: ScreenHeight * 0.05,
    borderRadius: ScreenHeight * 0.05 / 2,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  }

})

mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}

export default connect(mapStateToProps)(LandmarkDetails)
