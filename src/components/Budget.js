                    import React, { Component } from 'react';
                    import { connect } from 'react-redux';

                        class Budget extends Component {
                        
                            budgetChange(e) {
                                this.props.SET_BUDGET(e.target.value);
                            }
                            render() {
                            return (
                                <div  className="col s5">
                            <input require="true" id="icon_telephone" type="number" value={this.props.budget} name="budget" className="validate" onChange={(e) => this.budgetChange(e)} />
                                                        <label htmlFor="icon_telephone">Budget</label>

                                </div>
                            );
                            }
                        }
                        
                        export default connect(mapStateToProps, mapDispatchToProps)(Budget);

                        function mapStateToProps(state) {
                            return {
                                budget: state.budget,
                            
                            };
                        }
                        function mapDispatchToProps(dispatch) {
                            return {
                                SET_BUDGET: (budget) => {
                                    const action = { type: 'SET_BUDGET', data: budget };
                                    dispatch(action);
                                },
                            }
                        }

