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


import { GOOGLE_API } from '../utils/keysAPI'

import * as KnowledgeGraphAPI from '../utils/kgsAPI'


const { width } = Dimensions.get('window');

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
        console.log("USE WITH NAME");
        if (details) {
          this.setState({
            loading: false,
            details
          })
        } else {
          KnowledgeGraphAPI.getDetailWithID(this.props.location.mid)
            .then( res => {
              let details = fixLandmarkDetail(res)
              console.log("USE WITH ID");
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
    // console.log(this.state);


    const { location, multiple } = this.props
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
            <Text style={name.length > 23
                          ? { fontSize: 23 }
                          : styles.landmarkName }>{name}</Text>
          </View>

          { detailedDescription.articleBody.length < 500 &&
            <View style={styles.body}>
              <Text style={detailedDescription.articleBody.length < 360
                  ? styles.landmarkDetails
                  : {fontSize: 13, textAlign: 'center'}}>
                  {detailedDescription.articleBody}
                </Text>
              </View>
          }
          { detailedDescription.articleBody.length >= 500 &&
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                padding: 17,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              pinchGestureEnabled={true}
            >
              <Text style={{fontSize: 13, textAlign: 'center'}}>
                  {detailedDescription.articleBody}
              </Text>
            </ScrollView>
          }

          {detailedDescription.url &&
            <TouchableOpacity
                style={detailedDescription.url
                        ? styles.wikipediaLink
                        : {opacity: 0} }
                onPress={ () => {
                  Linking.openURL(detailedDescription.url)
                }}

            >
              <Text style={styles.wikipediaLinkText}>Read more on Wikipedia</Text>
            </TouchableOpacity>
          }


          {url &&
             <TouchableOpacity
                style={url
                        ? styles.footer
                        : {height: 0, opacity: 0} }
                onPress={ () => {
                  Linking.openURL(url)
                }}
              >
                <Text style={styles.website}>Go to website</Text>
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

export default LandmarkDetails

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
  landmarkName: {
    fontSize: 28,
  },
  landmarkImage: {
    // flex: 1,
    height: 190
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
  wikipediaLinkText: {
    fontSize: 16,
    color: cardButtonText
  },
  footer: {
    // flex: 0.2,
    height: 40,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  website: {
    fontSize: 16,
    color: cardButtonText
  }


})
