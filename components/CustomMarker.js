import {MapView} from 'expo';
import React, {Component} from 'react'

//Using this class as a workaround since onPress on googlemaps fails to give coordinates
//https://github.com/react-community/react-native-maps/issues/1967

export default class CustomMarker extends Component {
    onPress = (e)=>{
        e.stopPropagation();
        this.props.onPress({location: this.props.coordinate, id: this.props.id});
    }

    render(){
        return <MapView.Marker {...this.props} onPress={this.onPress} />
    }

}