import React, {Component} from 'react';
import {connect} from 'react-redux';

class Budget extends Component {

    budgetChange(e) {
        this
            .props
            .SET_BUDGET(e.target.value);
    }
    render() {
        return (
            <div className="col-3 input-field budget pl-0">
                <input
                    require="true"
                    id="budget"
                    type="number"
                    placeholder="Budget?"
                    name="budget"
                    className="validate"
                    onChange={(e) => this.budgetChange(e)}/>

            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Budget);

function mapStateToProps(state) {
    return {budget: state.reducer.budget};
}
function mapDispatchToProps(dispatch) {
    return {
        SET_BUDGET: (budget) => {
            const action = {
                type: 'SET_BUDGET',
                data: budget
            };
            dispatch(action);
        }
    }
}
