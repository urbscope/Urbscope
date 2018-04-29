import * as LocalStorage from '../utils/localStorageAPI'
import { Constants } from 'expo'

export const CHANGE_SETTINGS  = "CHANGE_SETTINGS"
export const LOAD_SETTINGS = "LOAD_SETTINGS"
export const CHANGE_COLOR = "CHANGE_COLOR"
export const SET_USERID = "SET_USERID"

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

export function setUserIDSuccess (id) {
  return{
    type: SET_USERID,
    id
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
      if (settings && settings.themeColor)
        dispatch(changeColor(settings.themeColor));
      callback()
    })
  }
}

export function setSettings (settings, callback) {
  callback = callback || function () {};

  return (dispatch) => {
    LocalStorage.setSettings(settings).then( () => {
      dispatch(setSettingsSuccess(settings))
      callback()
    })
  }
}

export function getUserID ( callback ) {
  callback = callback || function () {};

  console.log("GET USER ID FUNCTION CALL: ");




  return (dispatch) => {
    console.log("IN RETURN");
    // LocalStorage.getUID().then(id=>{
    //   console.log("id is ", id);
    // })

    //
    LocalStorage.getUID().then(id => {
      console.log("GOT USER ID: ", id);
      if (!id){
        console.log("IT IS NULL");

        let uid = Constants.deviceId;
        console.log("UNIQUE ID GENERATED: ", uid);

        fetch(`https://urbserver.herokuapp.com/register/${uid}`).then(res => {
          console.log("RESPONSE FROM SERVER: ", res);
          if (res.status == 200){
            LocalStorage.setUserID(uid);
            dispatch(setUserIDSuccess(uid))
            callback(uid);
          }
        })
      } else {
        dispatch(setUserIDSuccess(id))
        callback(id);
      }
    })
  }
}
