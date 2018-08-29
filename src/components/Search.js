import React, { Component } from 'react';
import { connect } from 'react-redux';
import './search.css';

import AutoCompleteTeminals from './AutoCompleteTeminals';
import DatePicker1 from './DatePicker';
import logo from '../content/images/logo.png';
import M from 'materialize-css';
import axios from 'axios';
import $ from 'jquery';





class Search extends Component {
    componentDidMount() {
        M.FormSelect.init(document.querySelectorAll('select'));
    }
    currencyChange(e) {
        this.props.SET_CURRENCY(e.target.value);
    }
    budgetChange(e) {
        this.props.SET_BUDGET(e.target.value);
    }
    render() {
        return (

            <div className="Search">
                <form onSubmit={(e) => { this.props.SUBMIT(e) }}>
                    <div className="searchBox container ">
                        <img src={logo} alt="logo" className="logo" />
                        <div className="row">
                            <div className="input-field col s1">
                                <i className="material-icons">place</i>
                            </div>
                            <div className="input-field col s11">
                                <AutoCompleteTeminals className="autocomplete" id="autocomplete-input" />
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s1">
                                <select name="currency" onChange={(e) => this.currencyChange(e)}>
                                    <option value="ils" defaultValue>₪</option>
                                    <option value="dollar">$</option>
                                    <option value="euro">€</option>
                                </select>
                            </div>

                            <div className="input-field col s4">

                                <input id="icon_telephone" type="number" name="budget" className="validate" onChange={(e) => this.budgetChange(e)} />
                                <label htmlFor="icon_telephone">Budget</label>

                            </div>
                            <div className="input-field col s6">

                                <DatePicker1 />

                            </div>
                        </div>
                        <button type="submit">Submit</button>

                        {this.props.terminal}
                    </div>
                </form>
            </div>
        );
    }
}



function mapStateToProps(state) {
    return {
        currency: state.currency,
        budget: state.budget,
        date: state.date,
        terminal: state.terminal
    };
}
function mapDispatchToProps(dispatch) {
    return {
        SUBMIT: (event) => {
            event.preventDefault()
         //change rout to results with new parameters
         dispatch('/results') /* dispatch an action that changes the browser history */
        },
        SET_CURRENCY: (currency) => {
            const action = { type: 'SET_CURRENCY', data: currency };
            dispatch(action);
        },
        SET_BUDGET: (budget) => {
            const action = { type: 'SET_BUDGET', data: budget };
            dispatch(action);
        },


    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
