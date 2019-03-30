import React from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';


class DatePicker1 extends React.Component {
        constructor (props) {
          super(props)
          this.state = {
            startDate: null,
            endDate : null
          };
          this.handleChange = this.handleChange.bind(this);
        }
      
        handleChange(date) {
            this.props.SET_DATE(date , this.props.dateInput);
            if ( this.props.dateInput  === "date")
          this.setState({
            startDate: date
          });
          else
          this.setState({
            endDate: date
          });
        }
      
         convertDate(date){
          return date.toDate().getFullYear() +  "/" + (date.getMonth() + 1) +   "/" +  date.getDate()
        }
        render() {
          return (
          <React.Fragment>
        <div className="col-1 p-0">
          <i className="material-icons">date_range</i>
        </div>
        <div className="col-5 p-0">
          
          <DatePicker name="date" autoComplete="off" require="true"
          placeholderText="Date" 
              selected={this.props.dateInput === "date" ? this.state.startDate : this.state.endDate} 
              onChange={this.handleChange}
          /></div>
          </React.Fragment>)
        }
}
export default connect(mapStateToProps, mapDispatchToProps)(DatePicker1);

function mapStateToProps(state) {
  return {
    date: state.reducer.date,
    return_date : state.reducer.return_date
  };
}
function mapDispatchToProps(dispatch) {
  return {
      SET_TERMINAL: (terminal) => {
          const action = { type: 'SET_TERMINAL', data: terminal };
          dispatch(action);
      }, 
      SET_DATE: (date , dateInput) => {
        const action = { type: 'SET_DATE', data: date , dateInput : dateInput };
        dispatch(action);
    }

  }
}


