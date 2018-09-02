
import React, {Component} from 'react';
import {connect} from 'react-redux';

class Direct extends Component {

   directChange(e) {
        this.props.SET_DIRECT(this.inputSwitch.checked);
    }
    render() {
        return (
            <div>
              <div className="switch">
 <label>
   <input type="checkbox" checked={this.props.direct} ref={(input) => { this.inputSwitch = input; }}   onChange={(e) => this.directChange(e)}/>
   <span className="lever"></span>
   Direct
 </label>
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

 