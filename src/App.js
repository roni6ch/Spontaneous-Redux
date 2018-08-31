import React, {Component} from 'react';
import {Provider} from 'react-redux';
import store from './store/';
import './App.css';
import Search from './components/Search';
import Results from './components/Results';
import Header from './components/Header';
import {BrowserRouter as Router, Route} from 'react-router-dom'

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <Router>
                      <div>
            <Header/>
                        <div className="wrapper">
                            <Route exact path="/" component={Search}/>
                            <Route path="/results" component={Results}/>
                        </div></div>
                    </Router>

                </div>
            </Provider>
        );
    }
}

export default App;
