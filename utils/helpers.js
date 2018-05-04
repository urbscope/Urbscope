import { red, green, black, blue, orange } from './colors'


export const fixDetectedLandmarks = (res) => {

  let landmarks = res.responses[0].landmarkAnnotations
  let result = []

  if (landmarks !== undefined) {
    result = landmarks.map( lm => {
      return {
        mid: lm.mid,
        description: lm.description,
        latitude: lm.locations[0].latLng.latitude,
        longitude: lm.locations[0].latLng.longitude,
      }
    })

    return result.reduce( (resultLocations, current) => {
      if (current.description !== undefined){
        let exists = resultLocations.find( x => x.description === current.description)
        if (!exists){
          return resultLocations.concat(current)
        }
      }
      return resultLocations
    }, [])

  } else {
    return null
  }
}

export const fixLandmarkDetailsFS = (res) => {
  let landmark = res.response.venues[0]

  if (landmark !== undefined) {
    return landmark
    // .map( lm => {
    //   return {
    //     id: lm.id,
    //     categories: lm.categories,
    //     contact: lm.contact,
    //     location: lm.location,
    //     address: lm.location.address,
    //     name: lm.name,
    //     website: lm.url,
    //     chains: lm.venueChains,
    //   }
    // })
  } else {
    return null
  }
}

export const formatLocation = (location, asObject = true)=> {
    if (!location)
        return null;
    else if (asObject) {
        if (location.coords)
            return {latitude: location.coords.latitude, longitude: location.coords.longitude};
        else
            return {latitude: location.latitude, longitude: location.longitude};
    }
    else {
        if (location.coords)
            return "" + location.coords.latitude + "," + location.coords.longitude;
        else
            return "" + location.latitude + "," + location.longitude;
    }
}

export const fixLandmarkDetail = (res) => {

  let detail = null

  if (res.itemListElement.length > 0 ){
    detail = res.itemListElement[0].result
  }

  return detail
}

export const fetchLandmarksFromServer= (url)=>{
  return fetch(url).then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            throw new Error('Landmark search error!');
        }
    })
        .then(responseJson => {
            let sponsored = responseJson.sponsoredItem;
            let {latitude,longitude} =  sponsored;
            sponsored['location'] = {latitude: parseFloat(latitude) , longitude: parseFloat(longitude) }
            sponsored['key'] = sponsored['destinationID'];

            let landmarks = responseJson.landmarks;
            let markers = {};
            for (obj of landmarks){
                coords = {lat: obj.latitude, lng: obj.longitude};
                markers[obj.destinationID] =  {
                    name: obj.name.toString(),
                    category: obj.category,
                    picture: obj.picture,
                    location: {latitude: parseFloat(coords.lat), longitude: parseFloat(coords.lng) },
                    key: obj.destinationID.toString(),
                    address: obj.address,
                    description: obj.description,
                }
            }
            return [markers, sponsored];
        })
        .catch(error => {
            console.error(error);
        });
}

export const CATEGORIES_NONE = '';
export const CATEGORIES_TOURISTIC_SITES = '56aa371be4b08b9a8d5734db,4fceea171983d5d06c3e9823,4bf58dd8d48988d1e2931735,5032792091d4c4b30a586d5c,56aa371be4b08b9a8d573532,4deefb944765f83613cdba6e,4bf58dd8d48988d181941735,507c8c4091d498d9fc8c67a9,4bf58dd8d48988d184941735,4bf58dd8d48988d17b941735';
export const CATEGORIES_AMPHITHEATERS = '56aa371be4b08b9a8d5734db';
export const CATEGORIES_AQUARIUMS = '4fceea171983d5d06c3e9823';
export const CATEGORIES_ART_GALLERIES = '4bf58dd8d48988d1e2931735';
export const CATEGORIES_CONCERT_HALLS = '5032792091d4c4b30a586d5c';
export const CATEGORIES_EXHIBITS = '56aa371be4b08b9a8d573532';
export const CATEGORIES_HISTORIC_SITES = '4deefb944765f83613cdba6e';
export const CATEGORIES_MUSEUMS = '4bf58dd8d48988d181941735';
export const CATEGORIES_PUBLIC_ART = '507c8c4091d498d9fc8c67a9';
export const CATEGORIES_STADIUMS = '4bf58dd8d48988d184941735';
export const CATEGORIES_ZOOS = '4bf58dd8d48988d17b941735';
export const CATEGORIES_RESTAURANTS = '4d4b7105d754a06374d81259';
export const CATEGORIES_NIGHTLIFE_SPOTS = '4d4b7105d754a06376d81259';
export const CATEGORIES_OUTDOORS_AND_RECREATION = '4d4b7105d754a06377d81259';
export const CATEGORIES_TRAVEL_AND_TRANSPORT = '4d4b7105d754a06379d81259';
export const CATEGORIES_AIRPORTS = '4bf58dd8d48988d1ed931735,4bf58dd8d48988d1fe931735,4f4530164b9074f6e4fb00ff,4bf58dd8d48988d129951735';
export const CATEGORIES_BUS_STATIONS = '4bf58dd8d48988d1fe931735';
export const CATEGORIES_TOURIST_INFORMATION_CENTERS = '4f4530164b9074f6e4fb00ff';
export const CATEGORIES_TRAIN_STATIONS = '4bf58dd8d48988d129951735';

export const DEFAULT_SETTINGS = {
  detectionLimit: 2,
  nearbyLimit: 10,
  nearbyRadius: 3000,
  categories: {
    [CATEGORIES_TOURISTIC_SITES]: false,
    [CATEGORIES_AMPHITHEATERS]: false,
    [CATEGORIES_AQUARIUMS]: false,
    [CATEGORIES_ART_GALLERIES]: false,
    [CATEGORIES_CONCERT_HALLS]: false,
    [CATEGORIES_EXHIBITS]: false,
    [CATEGORIES_HISTORIC_SITES]: true,
    [CATEGORIES_MUSEUMS]: true,
    [CATEGORIES_PUBLIC_ART]: false,
    [CATEGORIES_STADIUMS]: false,
    [CATEGORIES_ZOOS]: false,
    [CATEGORIES_RESTAURANTS]: true,
    [CATEGORIES_NIGHTLIFE_SPOTS]: false,
    [CATEGORIES_OUTDOORS_AND_RECREATION]: true,
    [CATEGORIES_TRAVEL_AND_TRANSPORT]: true,
    [CATEGORIES_AIRPORTS]: true,
    [CATEGORIES_BUS_STATIONS]: true,
    [CATEGORIES_TOURIST_INFORMATION_CENTERS]: true,
    [CATEGORIES_TRAIN_STATIONS]: true,
  },
  themeColor: red,
}
