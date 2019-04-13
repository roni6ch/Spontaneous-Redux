import React, { Component } from 'react';
import { connect } from 'react-redux';
import M from 'materialize-css';
import logo from '../content/images/logo.png';
import { MDBNavbar, MDBNavbarNav, MDBNavItem, MDBIcon } from "mdbreact";
import { Link } from 'react-router-dom';


class Header extends Component {

    constructor() {
        super();
        this.state = {
            collapseID: ""
        };
    }
    async componentDidMount() {
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

                    <Link to="/"><button href="#" className="brand-logo"><img alt="logo" src={logo} /></button></Link>
                    <MDBNavbarNav right>
                        <MDBNavItem>
                                <a href="http://RoniChabra.com" target="_blank" className="waves-effect waves-light" >
                                <MDBIcon fab icon="google-plus-g" /></a>
                        </MDBNavItem>
                        <MDBNavItem>
                            <a href="https://www.facebook.com/roni6ch" target="_blank" className="waves-effect waves-light" >
                                <MDBIcon fab icon="facebook" /></a>
                        </MDBNavItem>
                        <MDBNavItem>
                            <a href="https://www.linkedin.com/in/roni-chabra-61698558" target="_blank" className="waves-effect waves-light" >
                                <MDBIcon fab icon="linkedin" /></a>
                        </MDBNavItem>
                        <MDBNavItem>
                        <a href="https://gitlab.com/users/Roni691986/projects" target="_blank" className="waves-effect waves-light" >
                                <MDBIcon fab icon="gitlab" /></a>
                           
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

