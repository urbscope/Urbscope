import * as LocalStorage from '../utils/localStorageAPI'

export const CHANGE_SETTINGS  = "CHANGE_SETTINGS"
export const LOAD_SETTINGS = "LOAD_SETTINGS"
export const CHANGE_COLOR = "CHANGE_COLOR"

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

export function changeColor (color) {
  return {
    type: CHANGE_COLOR,
    color
  }
}

// ============================================================================
// THUNK MIDDLEWARE
// ============================================================================

export function loadSettings ( callback ) {
  callback = callback || function () {};

  return (dispatch) => {
    LocalStorage.getSettings().then((settings) => {
      dispatch(loadSettingsSuccess(settings));
      if (settings)
        dispatch(changeColor(settings.themeColor));
      callback()
    })
  }
}

export function setSettings (settings, callback) {
  callback = callback || function () {};

  return (dispatch) => {
    LocalStorage.setSettings(settings).then( () =>
      dispatch(setSettingsSuccess(settings)))
      callback()
  }
}
