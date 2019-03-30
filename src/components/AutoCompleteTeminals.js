import React from 'react';
import { connect } from 'react-redux';
import Autosuggest from 'react-autosuggest';
import './autocomplete.css';

class AutoCompleteTeminals extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };
  getSuggestionValue = (suggestion) => {
    this.props.placeholder === 'Origin' ? 
    this.props.SET_TERMINAL(suggestion.name) :
    this.props.SET_TERMINAL_DEST(suggestion.name)
    return suggestion.name;
  }
  renderSuggestion = (suggestion) => {
    return (
      <span>{suggestion.name}</span>
    );
  }
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  getSuggestions = (value) => {
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === '') {
      return [];
    }

    const regex = new RegExp('^' + escapedValue, 'i');

    return this.props.terminals.filter(terminal => regex.test(terminal.name));
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


