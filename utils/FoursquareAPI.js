// ==========================================================================
//  IMPORTING THE FOURSQUARE API AND INITIALIZING IT
// ==========================================================================

export const FS_CLIENT_ID = 'EECH5IF2TSK01WV2DQUKIRNT5CUVRTH0AVVDFM521E32ZVPH'
export const FS_CLIENT_PW = '1LL20JSTUVM1BM4G30E0KMN1QBKU3ZDVLMO1OP5QIPWCQEOK'

var foursquare = require('react-foursquare')({
  clientID: FS_CLIENT_ID,
  clientSecret: FS_CLIENT_PW
})

export const getLocationDetail = (name, latitude, longitude) => {
  foursquare.venues.getVenues({
    ll: `${latitude},${longitude}`,
    query: name,
    radius: 100,
    limit: 2
  }).then(res => {
    console.log(res.response.groups[0].items)
  })
}


export const getNearbyLocations = () => {}
