import React from 'react'

import AppWithStore from './AppWithStore'

import reducer from './reducers'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'


export default class App extends React.Component {


  render() {
    return (
      <Provider store={createStore(reducer, applyMiddleware(thunk))}>
        <AppWithStore />
      </Provider>
    )
  }
}
