import React from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import axios from 'axios';


// Imagine you have a list of terminals that you'd like to autosuggest.
var terminals = [];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : terminals.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);

class AutoCompleteTeminals extends React.Component {
  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      suggestions: []
    };
  }

  componentDidMount() {
   this.props.GET_TERMINALS();
}

  onChange = (event, { newValue }) => {
    this.props.SET_TERMINAL(newValue);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const {suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Origin?',
      name:"terminal",
      value : this.props.terminal,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <Autosuggest 
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteTeminals);

function mapStateToProps(state) {
  return {
      terminals: state.terminals,
      terminal: state.terminal,
  };
}
function mapDispatchToProps(dispatch) {
  return {
      SET_TERMINAL: (terminal) => {
          const action = { type: 'SET_TERMINAL', data: terminal };
          dispatch(action);
      },
      GET_TERMINALS: () => {
          axios.get('./data/terminals.json', {
          })
              .then(function (response) {
                  const action = { type: 'GET_TERMINALS', data: response.data };
                  dispatch(action);
                  var result = [];
                  response.data.map(function (t, i) {
                      //null can be image
                      var obj = {}
                      obj['name'] = t.code;
                      result.push(obj);
                  });
                  terminals = result;
              })
              .catch(function (error) {
                  console.log(error);
              });

      },

  }
}


