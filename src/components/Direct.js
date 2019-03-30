
import React, {Component} from 'react';
import {connect} from 'react-redux';

class Direct extends Component {

   directChange(e) {
        this.props.SET_DIRECT(this.inputSwitch.checked);
    }
    render() {
        return (
            <div>
                
                <div className="custom-control custom-checkbox pt-2">
    <input type="checkbox" className="custom-control-input" id="defaultUnchecked"
     checked={this.props.direct} ref={(input) => { this.inputSwitch = input; }}   onChange={(e) => this.directChange(e)}
      />
    <label className="custom-control-label" forname="defaultUnchecked">Direct?</label>
</div>


            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Direct);

function mapStateToProps(state) {
    return {direct: state.reducer.direct};
}
function mapDispatchToProps(dispatch) {
    return {
        SET_DIRECT: (direct) => {
            const action = {
                type: 'SET_DIRECT',
                data: direct
            };
            dispatch(action);
        }
    }
}

 