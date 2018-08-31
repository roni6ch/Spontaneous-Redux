import React, {Component} from 'react';
import {connect} from 'react-redux';
import M from 'materialize-css';
import logo from '../content/images/logo.png';

class Header extends Component {

    componentDidMount() {
        M.Sidenav.init(document.querySelectorAll('.sidenav'));
    }

    render() {
        return (
            <div>
                <nav>
                    <div className="nav-wrapper orange lighten-3">
                        <a href="/" className="brand-logo" onClick={() => {   this.props.INIT()  }} ><img src={logo}/></a>
                        <a href="/" data-target="mobile-demo" className="sidenav-trigger">
                            <i className="material-icons">menu</i>
                        </a>
                        <ul className="right hide-on-med-and-down">
                            <li>
                                <a href="http://Roni.pe.hu" target="_blank">About</a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <ul className="sidenav" id="mobile-demo">
                    <li>About</li>
                </ul>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {};
}
function mapDispatchToProps(dispatch) {
    return {
        INIT: () => {
            //change rout to results with new parameters
            const action = {
                type: 'INIT',
                data: false
            };
            dispatch(action);
        },
       
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Header);

