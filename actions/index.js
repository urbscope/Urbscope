import * as LocalStorage from '../utils/localStorageAPI'

export const CHANGE_SETTINGS  = "CHANGE_SETTINGS"
export const LOAD_SETTINGS = "LOAD_SETTINGS"


export function setSettingsSuccess (settings) {
  return {
    type: CHANGE_SETTINGS,
    settings
  }
}

export function loadSettingsSuccess (settings) {
  return {
    type: LOAD_SETTINGS,
    settings
  }
}

// ============================================================================
// THUNK MIDDLEWARE
// ============================================================================

export function loadSettings () {
  return (dispatch) => {
    LocalStorage.getSettings().then((settings) => {
      dispatch(loadSettingsSuccess(settings))
    })
  }
}

export function setSettings (settings) {
  return (dispatch) => {
    LocalStorage.setSettings(settings).then( () =>
      dispatch(setSettingsSuccess(settings)))
  }
}
