import React, {Component} from 'react';
import {connect} from 'react-redux';
import './search.css';

import AutoComplete from './AutoComplete';
import DatePicker1 from './DatePicker';
import Currency from './Currency';
import Budget from './Budget';
import ResultsNumber from './ResultsNumber';


import logo from '../content/images/logo.png';
import {Redirect} from 'react-router';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false
        }

        this
            .props
            .initState();

    }
    render() {
        if (this.props.submit === true) {
            return <Redirect to="/results"/>
        }
        return (

            <div className="Search">
                <form
                    onSubmit={(e) => {
                    this
                        .props
                        .SUBMIT(e)
                }}>
                    <div className="searchBox container blue  lighten-1 ">
                        <img src={logo} alt="logo" className="logo"/>
                        <div className="row">

<AutoComplete  place="Origin"/>
<AutoComplete  place="Destination"/>
                        </div>
                        <div className="row">
                            <DatePicker1 dateInput="date"/>
                            <DatePicker1 dateInput="returnDate"/>
                        </div>
                        <div className="row">
                            <Currency/>
                            <Budget/>
                            <ResultsNumber/>
                        </div>

                        <button
                            className="btn waves-effect waves-light blue-grey lighten-5 lighten-1"
                            type="submit"
                            name="action">Submit
                            <i className="material-icons right">send</i>
                        </button>

                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    console.log(state);
    return {currency: state.reducer.currency, budget: state.reducer.budget, date: state.reducer.date, terminal: state.reducer.terminal, submit: state.reducer.submit};
}
function mapDispatchToProps(dispatch) {
    return {
        initState: () => {
            //change rout to results with new parameters
            const action = {
                type: 'INIT',
                data: false
            };
            dispatch(action);
        },
        SUBMIT: (event) => {
            //change route to results with new parameters

            event.preventDefault();
            const action = {
                type: 'SUBMIT',
                data: true
            };
            dispatch(action);
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Search);
