import React, { Component } from 'react';
import { connect } from 'react-redux';

class Sidenav extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }
    render() {
        return (
            <div id="sidenavWrapper">
               
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
    };
}
function mapDispatchToProps(dispatch) {
    return {
       
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Sidenav);
