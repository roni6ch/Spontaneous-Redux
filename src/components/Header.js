import React, { Component } from 'react';
import { connect } from 'react-redux';
import M from 'materialize-css';
import logo from '../content/images/logo.png';
import {
    MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon
} from "mdbreact";


class Header extends Component {

    constructor() {
        super();
        this.state = {
            collapseID: ""
        };
    }
    componentDidMount() {
        M.Sidenav.init(document.querySelectorAll('.sidenav'));
    }
    toggleCollapse = collapseID => () =>
        this.setState(prevState => ({
            collapseID: prevState.collapseID !== collapseID ? collapseID : ""
        }));

    render() {
        return (
            <div className="navBarHeader">
                <MDBNavbar style={{ marginTop: "20px" }} dark>
                    <a href="#" className="brand-logo"><img alt="logo" src={logo} /></a>
                    <MDBNavbarNav right>
                        <MDBNavItem>
                            <MDBNavLink className="waves-effect waves-light" to="http://RoniChabra.com">
                                <MDBIcon fab icon="google-plus-g" />
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink className="waves-effect waves-light" to="https://www.facebook.com/roni6ch">
                                <MDBIcon fab icon="facebook" />
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink className="waves-effect waves-light" to="https://www.linkedin.com/in/roni-chabra-61698558">
                                <MDBIcon fab icon="linkedin" />
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink className="waves-effect waves-light" to="https://gitlab.com/users/Roni691986/projects">
                                <MDBIcon fab icon="gitlab" />
                            </MDBNavLink>
                        </MDBNavItem>
                    </MDBNavbarNav>
                </MDBNavbar>
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

