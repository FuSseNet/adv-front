import React, { useState } from 'react'
import './App.css'
import { persistor,store } from '../features/domain/redux/store'
import {PersistGate} from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
function App() {

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <>
            {

            }
          </>
          </PersistGate>
      </Provider>  
    </>
  )
}

export default App
