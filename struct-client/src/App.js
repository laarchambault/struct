import React from 'react';
import NavBar from './components/NavBar'
import Login from './components/login/Login'

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducer'

import './App.css';

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

function App() {
  return (
      <Provider store={store}>
      <div className="App">
        <NavBar/>
        <Login />
      </div>
    </Provider>
  );
}

export default App;
