import React, {Component} from 'react';
import {connect} from 'react-redux';
import M from 'materialize-css';

class ResultsNumber extends Component {
    componentDidMount() {
        M.FormSelect.init(document.querySelectorAll('select'));
    }
    
    resultsNumberChange(e) {
        this.props.SET_RESULTS_NUMBER(e.target.value);
    }
    render() {
        return (
            <div className="col s5">
                 <select name="resultNumber" require="true"
                   value={this.props.resultsNumber}
                    onChange={(e) => this.resultsNumberChange(e)}>
                <option value="10" defaultValue>10 Results</option>
                <option value="50" >50 Results</option>
                <option value="100">100 Results</option>
                <option value="200">200 Results</option>
                </select>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        resultsNumber : state.reducer.resultsNumber
    };
}
function mapDispatchToProps(dispatch) {
    return {
        SET_RESULTS_NUMBER: (result_number) => {
            const action = { type: 'SET_RESULTS_NUMBER', data: result_number };
            dispatch(action);
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ResultsNumber);
