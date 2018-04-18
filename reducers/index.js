import {
  CHANGE_SETTINGS,
  LOAD_SETTINGS
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


export default settings
