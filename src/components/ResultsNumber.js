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
            <div className="col s3">
                 <select name="resultNumber" require="true" onChange={(e) => this.resultsNumberChange(e)}>
                <option defaultValue>Results</option>
                <option value="10" defaultValue>10</option>
                <option value="50" >50</option>
                <option value="100">100</option>
                <option value="200">200</option>
                </select>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        resultsNumber : state.resultsNumber
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
