import { AsyncStorage } from 'react-native'
import { SETTINGS_STORAGE_KEY, VISITED_STORAGE_KEY } from './keysAPI'

export function setSettings ( settings ) {
  return AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
}

export function getSettings ( ) {
  return AsyncStorage.getItem(SETTINGS_STORAGE_KEY).then( entry =>
    JSON.parse(entry)
  )
}
