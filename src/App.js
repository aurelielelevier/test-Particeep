import './App.css';
import { useState, useEffect } from 'react';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import movies from './reducers/movies';

import Movies from './components/Movies'

const store = createStore(combineReducers({movies}));

function App() {
  
  return (
    <Provider store={store}>
      <Movies/>
    </Provider>
  );
}





export default App;

