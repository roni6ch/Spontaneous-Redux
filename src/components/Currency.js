    import React, { Component } from 'react';
        import { connect } from 'react-redux';
        import M from 'materialize-css';

        class Currency extends Component {
            componentDidMount() {
                M.FormSelect.init(document.querySelectorAll('select'));
            }
            
            currencyChange(e) {
                this.props.SET_CURRENCY(e.target.value);
            }
            render() {
            return (
                <div className="col s3">
                <select name="currency" 
                 value={this.props.currency}
                 require="true" onChange={(e) => this.currencyChange(e)}>
                <option value="USD" defaultValue>$</option>
                <option value="ILS" >₪</option>
                <option value="EUR">€</option>
                </select>
                </div>
            );
            }
        }
        
        export default connect(mapStateToProps, mapDispatchToProps)(Currency);

        function mapStateToProps(state) {
            return {
                currency: state.reducer.currency,
            
            };
        }
        function mapDispatchToProps(dispatch) {
            return {
                SET_CURRENCY: (currency) => {
                    const action = { type: 'SET_CURRENCY', data: currency };
                    dispatch(action);
                },
            }
        }

