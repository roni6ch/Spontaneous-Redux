import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store/';
import './App.css';
import Search from './components/Search';





class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <div className="App">
        <Search />
    </div>
    </Provider>
    );
  }
}

export default App;
