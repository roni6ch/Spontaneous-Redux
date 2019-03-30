import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store/';
import Search from './components/Search';
import Results from './components/Results';
import Header from './components/Header';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import './App.css';

class App extends Component {

    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <Router >
                        <div>
                            <Header />
                            <video className="video-intro" autoPlay loop muted>
                                <source src="https://mdbootstrap.com/img/video/Tropical.mp4" type="video/mp4" />
                            </video>

                            <div className="wrapper">
                                <Route path="/" exact  component={Search} />
                                <Route path="/results" component={Results} />
                            </div>
                        </div>
                    </Router>

                </div>
            </Provider>
        );
    }
}

export default App;
