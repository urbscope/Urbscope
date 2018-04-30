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

import { connect } from 'react-redux'


import { GOOGLE_API } from '../utils/keysAPI'

import * as KnowledgeGraphAPI from '../utils/kgsAPI'


const { width, height } = Dimensions.get('window');

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
            style={height > 700
                    ? styles.landmarkImage
                    : styles.landmarkImageltX }
          />

          <View style={height > 700
                  ? styles.header
                  : styles.headerltX }>
            <Text style={name.length > 23
                          ? { fontSize: 20 }
                          : styles.landmarkName }>{name}</Text>
          </View>


          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 17,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={height > 700
                ? {fontSize: 15, textAlign: 'center'}
                : {fontSize: 14, textAlign: 'center'}}>
                {detailedDescription.articleBody}
            </Text>
          </ScrollView>


          {detailedDescription.url &&
            <TouchableOpacity
                style={height > 700
                        ? styles.wikipediaLink
                        : styles.wikipediaLinkltX}
                onPress={ () => {
                  Linking.openURL(detailedDescription.url)
                }}

            >
              <Text style={[styles.wikipediaLinkText, {color: themeColor}]}>Read more on Wikipedia</Text>
            </TouchableOpacity>
          }


          {url &&
             <TouchableOpacity
                style={height > 700
                        ? styles.footer
                        : styles.footerltX}
                onPress={ () => {
                  Linking.openURL(url)
                }}
              >
                <Text style={[styles.website, {color: themeColor}]}>Go to website</Text>
              </TouchableOpacity>
          }


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
    // padding: 15,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  childViewSingle: {
    marginTop: 40,
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
    // padding: 15,
    justifyContent: 'space-around',
    alignItems: 'stretch',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    // flex: 0.3,
    height: 54,
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
    height: 190
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

  }

})

mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}

export default connect(mapStateToProps)(LandmarkDetails)
