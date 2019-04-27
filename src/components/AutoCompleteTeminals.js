import React from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import './autocomplete.css';

import axios from 'axios';

class AutoCompleteTeminals extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
      selectedOption: null,
      data: [],
      clickOnSelect: false
    };
  }

  onChange = (event, { newValue, method }) => {
    console.log(newValue);
    this.setState({
      value: newValue
    },()=>{
      
    const config = {
      headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
      }
  }
  var that  = this;
  if(this.state.value !== "" && this.state.value.length > 2 && !this.state.clickOnSelect){
    let url2 = `https://test.api.amadeus.com/v1/reference-data/locations?subType=CITY&keyword=${this.state.value}&page[limit]=10&page[offset]=0&sort=analytics.travelers.score&view=LIGHT`;
      axios.get(url2, config).then(function (response) {
        let data = [];
        let search = that.state.value.toLowerCase();
        response.data.data.forEach((result, index) => {
          data.push({
            value: result.name, label: result.iataCode
          });
        });
        console.log(data);
        
        if (search ==="tlv" || search ==="bgu" || search ==="tel"){
          data.push({value: 'Tel Aviv',label:'TLV'});
        }
        that.setState({suggestions:data});
       
    })
    .catch(function (error) {
        localStorage.removeItem("token");
        console.log(error);
    });
  }
    });
  };
  getSuggestionValue = (suggestion) => {
    this.props.placeholder === 'Origin' ? 
    this.props.SET_TERMINAL(suggestion.label) :
    this.props.SET_TERMINAL_DEST(suggestion.label)
    this.setState({clickOnSelect:true});
    return suggestion.value;
  }
  renderSuggestion = (suggestion) => {
    return (
      <span>{suggestion.label} - {suggestion.value}</span>
    );
  }
  onSuggestionsFetchRequested = ({ value }) => {
  };

  onSuggestionsClearRequested = () => {
  };
  getSuggestions = () => {

   // return this.props.terminals.filter(terminal => regex.test(terminal.name));
   return this.state.data.filter(terminal => terminal.name);
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: this.props.placeholder,
      value,
      onChange: this.onChange
    };


    return (
      <React.Fragment>
        <div className="col-1 p-0">
          <i className="material-icons">place</i>
        </div>
        <div className="col-5 autocomplete p-0">

          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={this.getSuggestionValue}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps} />
        </div>
      </React.Fragment>
    );
  }
}



function mapStateToProps(state) {
  return {
    terminal: state.reducer.terminal,
    terminalDest: state.reducer.terminalDest,
    terminals: state.reducer.terminals
  };
}
function mapDispatchToProps(dispatch) {
  return {
    SET_TERMINAL: (terminal) => {
      const action = { type: 'SET_TERMINAL', data: terminal };
      dispatch(action);

    },
    SET_TERMINAL_DEST: (terminal) => {
      const action = { type: 'SET_TERMINAL_DEST', data: terminal };
      dispatch(action);
    },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteTeminals);


