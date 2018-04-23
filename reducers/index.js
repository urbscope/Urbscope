
import { combineReducers } from 'redux'

import {
  CHANGE_SETTINGS,
  LOAD_SETTINGS,
  CHANGE_COLOR,
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


export default combineReducers({
  themeColor,
  settings,
})
