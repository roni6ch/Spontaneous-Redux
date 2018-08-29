import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';


class DatePicker1 extends React.Component {
        constructor (props) {
          super(props)
          this.state = {
            startDate: null
          };
          this.handleChange = this.handleChange.bind(this);
        }
      
        handleChange(date) {
            this.props.SET_DATE(date);
          this.setState({
            startDate: date
          });
        }
      
        render() {
          return <DatePicker name="date" autoComplete="off"
          placeholderText="Date" 
              selected={this.state.startDate}
              onChange={this.handleChange}
          />;
        }
}
export default connect(mapStateToProps, mapDispatchToProps)(DatePicker1);

function mapStateToProps(state) {
  return {
    date: state.date
  };
}
function mapDispatchToProps(dispatch) {
  return {
      SET_TERMINAL: (terminal) => {
          const action = { type: 'SET_TERMINAL', data: terminal };
          dispatch(action);
      }, 
      SET_DATE: (date) => {
         var date = moment(date, "MM-DD-YYYY").toDate();
        const action = { type: 'SET_DATE', data: date };
        dispatch(action);
    }

  }
}


