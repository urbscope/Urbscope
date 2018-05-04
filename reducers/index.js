
import { combineReducers } from 'redux'

import {
  CHANGE_SETTINGS,
  LOAD_SETTINGS,
  CHANGE_COLOR,
  SET_USERID,
  SET_HASVISITED_TRUE,
  SET_HASVISITED_FALSE
} from '../actions'


settings = (state={}, action) => {
  const { type, settings } = action

  switch (type) {
    case CHANGE_SETTINGS:
      return settings

    case LOAD_SETTINGS:
      return settings

    default:
      return state
  }
}

themeColor = (state={}, action) => {
  const { type, color } = action

  switch (type) {
    case CHANGE_COLOR:
      return color

    default:
      return state
  }
}

userID = (state={}, action) => {
  const { type, userID } = action

  switch (type) {
    case SET_USERID:
      return userID

    default:
      return state
  }
}

hasVisitedIsChanged = (state= false, action) => {
    const { type} = action;

    switch (type) {
        case SET_HASVISITED_TRUE:
            return true
        case SET_HASVISITED_FALSE:
            return false
        default:
            return state
    }
}

export default combineReducers({
  themeColor,
  settings,
  userID,
  hasVisitedIsChanged
})
