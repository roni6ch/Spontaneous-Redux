import React, { Component } from 'react';
import ReactAutocomplete from 'react-autocomplete'
import { connect } from 'react-redux';
import axios from 'axios';

class AutoComplete extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.terminal,
            valueDest :  this.props.terminalDest,
            items : [
               
              ]
            
        }

    }
    
    componentDidMount() {
        this.props.GET_TERMINALS();
      }
    
    render() {
        return (
            <div>
        <div className=" col s1">
        <i className="material-icons">place</i>
    </div>
        <div className=" col s5 autocomplete">
        
                <ReactAutocomplete
        items={terminals}
        shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
        getItemValue={item => item.label}
        renderItem={(item, highlighted) =>
          <div
            key={item.label}
            style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
          >
            {item.label}
          </div>
        }
        value={this.props.place === 'Origin' ? this.state.value :  this.state.valueDest}
        onChange={this.props.place === 'Origin' ? (e) => this.setState({value:e.target.value}) :  (e) => this.setState({valueDest:e.target.value})}
        onSelect={this.props.place === 'Origin' ? (value =>  (this.props.SET_TERMINAL(value), this.setState({value}))) 
        : (value => (this.props.SET_TERMINAL_DEST(value), this.setState({valueDest:value})))}
      />
            </div>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AutoComplete);
var terminals = [];
function mapStateToProps(state) {
  return {
      terminals: state.reducer.terminals,
      terminal: state.reducer.terminal,
      terminalDest : state.reducer.terminalDest
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
      GET_TERMINALS: () => {
          axios.get('./data/terminals2.json', {
          })
              .then(function (response) {
                var res = response.data[0].split(",");
                  const action = { type: 'GET_TERMINALS', data: response.data };
                  dispatch(action);
                  var result = [];
                  result = res.map(function (t, i) {
                      //null can be image
                      var obj = {}
                      obj['label'] = t;
                      return obj;
                  });
                 terminals = result;
              })
              .catch(function (error) {
                  console.log(error);
              });

      },

  }
}


