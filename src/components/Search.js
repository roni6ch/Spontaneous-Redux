import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './search.css';

import AutoCompleteTeminals from './AutoCompleteTeminals';
import DatePicker1 from './DatePicker';
import Currency from './Currency';
import Budget from './Budget';
import ResultsNumber from './ResultsNumber';
import Direct from './Direct';
import { MDBBtn, MDBIcon } from "mdbreact";
import { Link } from 'react-router-dom';
import logo from '../content/images/logo.png';
import { Redirect } from 'react-router';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false
        }
        this.props.initState();
    }

    componentDidMount() {
        this.props.GET_TERMINALS();
    }
    render() {
        if (this.props.submit === true) {
            return <Redirect to="/results" />
        }
        return (
            <div className="Search">
                <form onSubmit={(e) => { this.props.SUBMIT(e) }}>
                    <div className="searchBox container p-4">
                        <img src={logo} alt="logo" className="logo" />
                        <div className="row">

                            <AutoCompleteTeminals placeholder="Origin" />
                            <AutoCompleteTeminals placeholder="Destination" />

                        </div>
                        <div className="row pt-4 pb-4">
                            <DatePicker1 dateInput="date" />
                            <DatePicker1 dateInput="returnDate" />
                        </div>
                        <div className="row">
                            <Currency />
                            <Budget />
                            <ResultsNumber />
                            <Direct />
                        </div>

                        <div className="row">
                            <div className="submit col-12 pt-4">
                                <Link to="/results">
                                    <MDBBtn color="primary">
                                        Submit  <MDBIcon icon="paper-plane" className="mr-1" />
                                    </MDBBtn></Link>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        currency: state.reducer.currency,
        budget: state.reducer.budget,
        date: state.reducer.date,
        terminal: state.reducer.terminal,
        terminalDest: state.reducer.terminalDest,
        direct: state.reducer.direct,
        submit: state.reducer.submit
    };
}
function mapDispatchToProps(dispatch) {
    return {
        initState: () => {
            const action = {
                type: 'INIT',
                data: false
            };
            dispatch(action);
        },
        GET_TERMINALS: () => {

            axios.get('./data/terminals3.json', {
            })
                .then(function (response) {
                    var traveltsResult = [];
                    response.data.forEach(function (res, index) {
                        var jsonObj = {
                            name: res
                        };
                        traveltsResult.push(jsonObj);
                    });
                    const action = { type: 'SET_TERMINALS', data: traveltsResult };
                    dispatch(action);
                })
                .catch(function (error) {
                    console.log(error);
                });

        },
        SUBMIT: (e) => {
            e.preventDefault();
            const action = {
                type: 'SUBMIT',
                data: true
            };
            dispatch(action);
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Search);
