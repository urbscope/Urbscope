import React, {Component} from 'react'
import {StyleSheet, ScrollView, View, Text, Image, TouchableOpacity} from "react-native";

const defaultPicture = require('../assets/urbscope_loading.png');

class NearbyLocationsList extends React.Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        let locations = this.props.locations;

        return (<ScrollView style={styles.container} >
            {locations.map(val => {
                let picture=  defaultPicture;
                if (val.picture)
                    picture = val.picture;
                return <TouchableOpacity onPress={()=>this.props.handlePress(val.key)}>
                    <View style={styles.listItem} >
                        <Image style={styles.Image}
                            source={{uri: picture}}
                        />
                        <View>
                            <Text>
                                {val.name}
                            </Text>
                            <Text>
                                {val.category}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                })
            }
        </ScrollView>)
    }
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: 300,
        width: 300,
        borderTopWidth: 0.5,
        backgroundColor: '#EEE'
    },
    listItem: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        height:  60,
    },
    Image: {
        height: '100%',
        width: 60,
        borderRightWidth: 0.5,
    },
});

export default NearbyLocationsList;
