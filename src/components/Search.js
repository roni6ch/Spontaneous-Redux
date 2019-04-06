import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './search.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import AutoCompleteTeminals from './AutoCompleteTeminals';
import Currency from './Currency';
import Budget from './Budget';
import { MDBBtn, MDBIcon } from "mdbreact";
import { Link } from 'react-router-dom';
import logo from '../content/images/logo.png';
import { Redirect } from 'react-router';
import moment from 'moment';

var i = 0;
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false,
            startDate: null,
            endDate: null
        }
        this.props.initState();
    }

    componentDidMount() {
        this.props.GET_TERMINALS();
    }
    dateChange = (date, dateInput) => {
        if (dateInput === 'date')
            this.setState({
                startDate: date
            });
        else
            this.setState({
                endDate: date
            });
        this.props.SET_DATE(date, dateInput);
    }
    render() {
        if (this.props.submit === true) {
            return <Redirect to="/results" />
        }
        return (
            <div className="Search">
                <form onSubmit={(e) => { this.props.SUBMIT(e) }}  autoComplete="off">
                    <div className="searchBox container p-4">
                        <img src={logo} alt="logo" className="logo" />
                        <div className="row">

                            <AutoCompleteTeminals placeholder="Origin" />
                            <AutoCompleteTeminals placeholder="Destination" />

                        </div>
                        <div className="row pt-4 pb-4">

                            <div className="col-1 p-0">
                                <i className="material-icons">date_range</i>
                            </div>
                            <div className="col-5 p-0">
                                <DatePicker placeholderText="Start Date"
                                    id="startDate"
                                    selected={this.state.startDate}
                                    selectsStart
                                    minDate={moment()}
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                    onChange={(date) => this.dateChange(date, 'date')}
                                />
                            </div>

                            <div className="col-1 p-0">
                                <i className="material-icons">date_range</i>
                            </div>
                            <div className="col-5 p-0">
                                <DatePicker placeholderText="End Date"
                                    id="endDate"
                                    selected={this.state.endDate}
                                    minDate={this.state.startDate}
                                    selectsEnd
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                    onChange={(date) => this.dateChange(date, 'return_date')}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <Currency />
                            <Budget />
                            {/*<ResultsNumber /> 
                            <Direct />*/}
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
        SET_DATE: (date, dateInput) => {
            const action = { type: 'SET_DATE', data: moment(date).format('YYYY-MM-DD'), dateInput: dateInput };
            dispatch(action);
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
