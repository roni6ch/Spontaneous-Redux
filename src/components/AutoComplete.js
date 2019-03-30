import React, { Component } from 'react';
import { connect } from 'react-redux';
import AutoCompleteTeminals from './AutoCompleteTeminals';

class AutoComplete extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.terminal,
      valueDest: this.props.terminalDest,
      items: [
      ],
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-1 p-0">
          <i className="material-icons">place</i>
        </div>
        <div className="col-5 autocomplete p-0">
        <AutoCompleteTeminals  placeholder={this.props.placeholder} terminals={this.props.terminals} />
         {/* <ReactAutocomplete
            items={terminals}
            shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
            getItemValue={item => item.label}
            renderItem={(item, highlighted) =>
              <div  key={item.label}  style={{ backgroundColor: highlighted ? '#eee' : 'transparent' }} > {item.label}  </div>
            }
            value={this.props.place === 'Origin' ? this.state.value : this.state.valueDest}
            onChange={this.props.place === 'Origin' ? (e) => this.setState({ value: e.target.value }) : (e) => this.setState({ valueDest: e.target.value })}
            onSelect={this.props.place === 'Origin' ? (value => (this.props.SET_TERMINAL(value), this.setState({ value })))
              : (value => (this.props.SET_TERMINAL_DEST(value), this.setState({ valueDest: value })))}
          /> */}
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
export default connect(mapStateToProps, mapDispatchToProps)(AutoComplete);


