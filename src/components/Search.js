import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './search.css';

import AutoComplete from './AutoComplete';
import DatePicker1 from './DatePicker';
import Currency from './Currency';
import Budget from './Budget';
import ResultsNumber from './ResultsNumber';
import Direct from './Direct';

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
                <form onSubmit={(e) => {  this.props.SUBMIT(e)  }}>
                    <div className="searchBox container ">
                        <img src={logo} alt="logo" className="logo" />
                        <div className="row">

                          <AutoComplete place="Origin" />
                            <AutoComplete place="Destination" />
       
                        </div>
                        <div className="row">
                            <DatePicker1 dateInput="date" />
                            <DatePicker1 dateInput="returnDate" />
                        </div>
                        <div className="row">
                            <Currency />
                            <Budget />
                            <ResultsNumber />
                        </div>


                        <div className="row">
                            <div className="col s4">
                                <Direct />
                            </div> <div className="col s8">

                                <button
                                    className="btn waves-effect waves-light blue-grey lighten-5 lighten-1"
                                    type="submit"
                                    name="action">Submit
                            <i className="material-icons right">send</i>
                                </button></div> </div>




                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    console.log(state);
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
     
        axios.get('./data/terminals2.json', {
        })
          .then(function (response) {
            var result = JSON.stringify(response.data[0]);
            var jsonObj = {};
            response.data.forEach(function (res, index) {
                jsonObj[res] = null;
            });
            console.log(jsonObj);
            const action = { type: 'GET_TERMINALS', data: jsonObj };
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
