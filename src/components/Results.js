import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import M from 'materialize-css';
import './results.css';
import DatePicker1 from './DatePicker';
import AutoComplete from './AutoComplete';
import Currency from './Currency';
import Budget from './Budget';
import ResultsNumber from './ResultsNumber';

function splitHour(date) {
    if (date !== null && date !== undefined) {
        var array = date.split('T');
        return array[1];
    }
}
function calcFlightTime(returnFrom, depart, arrive) {
    if (depart !== null && depart !== undefined && arrive !== null && arrive !== undefined) {
        var difference = ((new Date(arrive)) - (new Date(depart)));
        var diff = new Date(difference / (60000) * 1000)
            .toUTCString()
            .split(" ")[4];

        return parseInt(diff.split(":")[1],10) + "h:" + diff.split(":")[2] + "m";
    }
}

class Results extends React.Component {
 
    componentDidMount() {

        this
            .props
            .TIMEZONE();
        this
            .props
            .SET_RESULTS(this.props.currency, this.props.terminal, this.props.budget, this.props.date, this.props.terminalDest, this.props.resultsNumber, this.props.return_date);

   
          }

    filter() {

        this
            .props
            .SET_RESULTS(this.props.currency, this.props.terminal, this.props.budget, this.props.date, this.props.terminalDest, this.props.resultsNumber, this.props.return_date)
    }
    render() {
        return <div className="resultsWrapper">

            <div className="resultsFilter row blue  lighten-1">




<AutoComplete  place="Origin"/>
<AutoComplete  place="Destination"/>
                <DatePicker1 dateInput="date"/>
                <DatePicker1 dateInput="returnDate"/>
                <div>
                <Currency/>
                <Budget/>
                <ResultsNumber/>
                </div>
                <button
                    className="btn waves-effect  waves-light blue-grey lighten-5 lighten-1"
                    type="submit"
                    onClick={() => this.filter()}
                    name="action">Filter!
                    <i className="material-icons right">send</i>
                </button>

            </div>

            <div className="row">

                {this.props.results.length === 0 && this.props.error === ""  ? <div className="lds-hourglass" ref="spinner"></div>  : ''}

                {this.props.error
                    ? <div className="error red">
                            Error : {this.props.error}</div>
                    : ''}

                {this
                    .props
                    .results
                    .map((result, index) => {
                        return (result.itineraries.map((r, i) => {
                            return (
                                <ul className="collapsible col s12 m6 z-depth-3" key={i}>
                                    {/* li header */}
                                    <li>

                                        <div className="collapsible-header">
                                            <span >Price:
                                                <b>{result.fare.price_per_adult.total_fare}</b>
                                            </span>
                                            <span>
                                                {this.props.currency}</span>
                                            <span>
                                                Per 1</span>
                                            <button
                                                type="button"
                                                className="btn btn-info bookAFlight waves-effect waves-light blue lighten-1">Book Flight</button>
                                        </div>
                                    </li>

                                    <li>
                                        <div className="collapsible-header">
                                            {/*outbound */}
                                            <p className="col s3">
                                                <img
                                                    src={`http://pics.avs.io/100/30/${r.outbound.flights[0].operating_airline}.png`}
                                                    alt='logo'/>
                                            </p>
                                            <div className="col s4">
                                                <span>
                                                    <b>{r.outbound.flights[0].origin.airport}</b>
                                                </span>
                                                <span>{splitHour(r.outbound.flights[0].departs_at)}</span>
                                                <i className="material-icons fa-rotate-90">airplanemode_active</i>
                                                <span>
                                                    <b>{r.outbound.flights[r.outbound.flights.length - 1].destination.airport}</b>
                                                </span>
                                                <span>{splitHour(r.outbound.flights[r.outbound.flights.length - 1].arrives_at)}</span>
                                                <div className="timeAndstops">
                                                    <i className="material-icons">alarm</i>

                                                    <span>
                                                        {calcFlightTime('local', r.outbound.flights[0].arrives_at, r.outbound.flights[r.outbound.flights.length - 1].departs_at)}</span>
                                                    <p>{r.outbound.flights.length - 1}
                                                        Stops</p>

                                                </div>
                                            </div>

                                            {/*inbound*/}
                                            <div className="col s4">
                                                <span >
                                                    <b>{r.inbound.flights[0].origin.airport}</b>
                                                </span>
                                                <span>{splitHour(r.inbound.flights[0].departs_at)}</span>
                                                <i className="material-icons fa-rotate-270">airplanemode_active</i>
                                                <span >
                                                    <b>{r.inbound.flights[r.inbound.flights.length - 1].destination.airport}</b>
                                                </span>
                                                <span>{splitHour(r.inbound.flights[r.inbound.flights.length - 1].arrives_at)}</span>
                                                <div className="timeAndstops">

                                                    <i className="material-icons">alarm</i>
                                                    <span>
                                                        {calcFlightTime('destination', r.inbound.flights[0].arrives_at, r.inbound.flights[r.inbound.flights.length - 1].departs_at)}</span>
                                                    <p>
                                                        <span>{r.inbound.flights.length - 1}
                                                            Stops</span>
                                                    </p>

                                                </div>
                                            </div>

                                        </div>
                                        {/*body*/}
                                        <div className="collapsible-body ">
                                            <div className="row">
                                                <div className="col s8">
                                                    {/*outbound info*/}
                                                    {r
                                                        .outbound
                                                        .flights
                                                        .map(function (flight, i) {
                                                            return (
                                                                <div key={i}>
                                                                    <span >
                                                                        {flight.origin.airport}</span>
                                                                    <span>{splitHour(flight.departs_at)}</span>
                                                                    <i className="material-icons fa-rotate-90">airplanemode_active</i>
                                                                    <span >
                                                                        {flight.destination.airport}</span>
                                                                    <span>{splitHour(flight.arrives_at)}</span>
                                                                </div>
                                                            );
                                                        })}

                                                    <p className="connectionTime">
                                                        {calcFlightTime('local', r.outbound.flights[0].arrives_at, r.outbound.flights[r.outbound.flights.length - 1].departs_at)}
                                                        Connection
                                                    </p>

                                                    <hr></hr>
                                                    {/*inbound info*/}

                                                    {r
                                                        .inbound
                                                        .flights
                                                        .map(function (flight, i) {
                                                            return (
                                                                <div key={i}>
                                                                    <span >
                                                                        {flight.origin.airport}</span>
                                                                    <span>{splitHour(flight.departs_at)}</span>
                                                                    <i className="material-icons fa-rotate-270">airplanemode_active</i>
                                                                    <span >
                                                                        {flight.destination.airport}</span>
                                                                    <span>{splitHour(flight.arrives_at)}</span>
                                                                </div>
                                                            );
                                                        })}

                                                    <p className="connectionTime">
                                                        {calcFlightTime('local', r.inbound.flights[0].arrives_at, r.inbound.flights[r.inbound.flights.length - 1].departs_at)}
                                                        Connection
                                                    </p>

                                                </div>
                                                <div className="col s4 left-align otherInfo">
                                                    <p>
                                                        Seats Remaining:
                                                        <b>{r.outbound.flights[0].booking_info.seats_remaining}</b>
                                                    </p>
                                                    {r.outbound.flights[0].origin.terminal ? <p>
                                                        Terminal:
                                                        <b>{r.outbound.flights[0].origin.terminal}</b>
                                                    </p> : "" }
                                                    <p>
                                                        Flight Number:
                                                        <b>{r.outbound.flights[0].flight_number}</b>
                                                    </p>
                                                    <p>
                                                        Travel Class:
                                                        <b>{r.outbound.flights[0].booking_info.travel_class}</b>
                                                    </p>
                                                    <p>
                                                        Destination:
                                                        <b>{r.outbound.flights[0].destination.airport}</b>
                                                    </p>
                                                </div>

                                            </div>

                                        </div>
                                    </li>

                                </ul>
                            )
                        }));
                    })}
            </div>
        </div>;
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Results);

function mapStateToProps(state) {
    return {
        results: state.reducer.results,
        timezone: state.reducer.timezone,
        currency: state.reducer.currency,
        terminal: state.reducer.terminal,
        date: state.reducer.date,
        return_date: state.reducer.return_date,
        error: state.reducer.error,
        budget: state.reducer.budget,
        terminalDest: state.reducer.terminalDest,
        resultsNumber: state.reducer.resultsNumber
    };
}
function mapDispatchToProps(dispatch) {
    return {
        SET_RESULTS: (currency, terminal, budget, date, terminalDest, resultsNumber, return_date) => {

            const action = {
                type: 'INIT_RESULTS'
            };
            dispatch(action);

            axios
           //  .get('./data/flights2.json', {}) 
             //max_price works only with currency=USD!
                .get(`https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey=ikb2WCbOOrKkFf5biRa1GmuoGObAz9L7&currency=${currency}&max_price=${budget}&origin=${terminal}&destination=${terminalDest}&departure_date=${date}&return_date=${return_date}&number_of_results=${resultsNumber}`, {})
                .then(function (response) {
                    console.log(response.data.results);
                    const action = {
                        type: 'SET_RESULTS',
                        data: response.data.results
                    };
                    dispatch(action);
                    //init collapsible currency
                    M
                        .Collapsible
                        .init(document.querySelectorAll('.collapsible'));
                })
                .catch(function (error) {
                    console.log(error);

                    var err = error.response.data
                        ? error.response.data.message
                        : error.message;
                    const action = {
                        type: 'RESULTS_ERROR',
                        data: err
                    };
                    dispatch(action);

                });

        },
        TIMEZONE: () => {
            axios
                .get('./data/timeZoneByAirports.json', {})
                .then(function (response) {
                    var timezone = {};
                    response
                        .data
                        .forEach(function (timeZone) {
                            if (timeZone.code === 'TLV') {
                                timezone['origin_timezone'] = timeZone.offset.gmt
                            }
                            if (timeZone.code === 'LAX') {
                                timezone['destination_timezone'] = timeZone.offset.gmt
                            }
                        })


                    const action = {
                        type: 'TIMEZONE',
                        data: timezone
                    };
                    dispatch(action);

                })
                .catch(function (error) {
                    console.log(error);
                });

        }
    }
}