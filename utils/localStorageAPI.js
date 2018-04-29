import { AsyncStorage } from 'react-native'

import { SETTINGS_STORAGE_KEY, VISITED_STORAGE_KEY, UID_STORAGE_KEY } from './keysAPI'

export function setSettings ( settings ) {
  return AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

export function getSettings ( ) {
  return AsyncStorage.getItem(SETTINGS_STORAGE_KEY).then( entry =>
    JSON.parse(entry)
  )
}

export function getVisitedLocations(){
  // AsyncStorage.removeItem(VISITED_STORAGE_KEY);
  return AsyncStorage.getItem(VISITED_STORAGE_KEY).then(entry=> {
          return JSON.parse(entry)
      }
  )
}

export function updateVisitedLocations(entry) {
  /*entry is of form:
    locationID: {
        name:
        description:
        address:
        rating:
    }
   */
  return AsyncStorage.mergeItem(VISITED_STORAGE_KEY, JSON.stringify(entry), (error)=>console.log(error));
}


export function getUID(){
    return AsyncStorage.getItem(UID_STORAGE_KEY).then( entry =>
        JSON.parse(entry)
    )
}

export function setUserID(id){
    return AsyncStorage.setItem(UID_STORAGE_KEY, id);
}
