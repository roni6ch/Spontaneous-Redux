import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import M from 'materialize-css';
import './results.css';
import { AmadeusApi }  from './Amadeus';


function splitHour(date) {
    if (date !== null && date !== undefined) {
        var array = date.split('T');
        return array[1];
    }
}
function splitDate(date) {
    if (date !== null && date !== undefined) {
        var array = date.split('T');
        return array[0];
    }
}
function calcFlightTime(returnFrom, depart, arrive) {
    if (depart !== null && depart !== undefined && arrive !== null && arrive !== undefined) {
        var difference = ((new Date(arrive)) - (new Date(depart)));
        var diff = new Date(difference / (60000) * 1000)
            .toUTCString()
            .split(" ")[4];

        return parseInt(diff.split(":")[1], 10) + "h:" + diff.split(":")[2] + "m";
    }
}

class Results extends React.Component {
    constructor() {
        super();
        this.AmadeusApi = AmadeusApi.bind(this);
    }
    async componentDidMount() {

        this.props.TIMEZONE(this.props.terminal, this.props.terminalDest);
        let access_token =  await this.AmadeusApi();
        this.props.INIT_AMADEUS(access_token);
        const config = {
            headers: {
                "Authorization": "Bearer " + access_token
            }
        }
        const url = `https://test.api.amadeus.com/v1/shopping/flight-offers?origin=${this.props.terminal}&destination=${this.props.terminalDest}&maxPrice=${this.props.budget}&currency=${this.props.currency}&nonStop=${this.props.direct}&departureDate=${this.props.date}&returnDate=${this.props.return_date}`;
        var that = this;
        axios.get(url, config)
            .then(function (response) {
                console.log(response.data.data);
                that.props.SET_RESULTS('SET_RESULTS', response.data.data);
                //init collapsible currency
                M.Collapsible.init(document.querySelectorAll('.collapsible'));
            })
            .catch(function (error) {
                console.log(error);
                that.props.SET_RESULTS('RESULTS_ERROR', error);
            });

    }

    filter() {
       // let { currency, terminal, budget, date, terminalDest, resultsNumber, return_date, direct } = this.props;
        // this.props.SET_RESULTS( currency,terminal ,budget,date,terminalDest,resultsNumber,return_date,direct);    }
    }
    render() {
        return <div className="resultsWrapper">
            {this.props.results.length === 0 && this.props.error === "" ? <div className="lds-hourglass" ref="spinner"></div> : ''}
            {this.props.error ? <div className="error red">   Error : {this.props.error}</div> : ''}
            <div className="row">
                {this.props.results.map((result, index) => {
                    return (result.offerItems.map((r, i) => {
                        return (
                            <ul className="collapsible col-12 z-depth-3" key={index}>
                                <li>
                                    <div className="collapsible-header infoBody row">

                                        {/*outbound */}
                                        <p className="col-2 companyLogo">
                                            <img
                                                src={`http://pics.avs.io/100/30/${r.services[0].segments[0].flightSegment.operating.carrierCode}.png`}
                                                alt='logo' />
                                        </p>
                                        <div className="col-3 relative">
                                            <span>
                                                <b>{r.services[0].segments[0].flightSegment.departure.iataCode}</b>
                                            </span>
                                            <span>{splitHour(r.services[0].segments[0].flightSegment.departure.at)}</span>
                                            <i className="material-icons fa-rotate-90">airplanemode_active</i>
                                            <span>
                                                <b>{r.services[r.services.length - 1].segments[0].flightSegment.arrival.iataCode}</b>
                                            </span>
                                            <span>{splitHour(r.services[r.services.length - 1].segments[0].flightSegment.arrival.at)}</span>


                                            {r.outbound.flights.length - 1 === 1 ? <div className="timeAndstops">
                                                <i className="material-icons">alarm</i>
                                                <span>  {r.services[r.services.length - 1].segments[0].flightSegment.duration}</span>
                                                <span>{r.services[0].segments.length - 1} Stops</span>

                                            </div> : ''}
                                        </div>

                                        {/*inbound*/}
                                        <div className="col-3 relative">
                                            <span >
                                                <b>{r.inbound.flights[0].origin.airport}</b>
                                            </span>
                                            <span>{splitHour(r.inbound.flights[0].departs_at)}</span>
                                            <i className="material-icons fa-rotate-270">airplanemode_active</i>
                                            <span >
                                                <b>{r.inbound.flights[r.inbound.flights.length - 1].destination.airport}</b>
                                            </span>
                                            <span>{splitHour(r.inbound.flights[r.inbound.flights.length - 1].arrives_at)}</span>
                                            {r.inbound.flights.length - 1 === 1 ? <div className="timeAndstops">

                                                <i className="material-icons">alarm</i>
                                                <span>
                                                    {calcFlightTime('destination', r.inbound.flights[0].arrives_at, r.inbound.flights[r.inbound.flights.length - 1].departs_at)}</span>

                                                <span>{r.inbound.flights.length - 1}
                                                    Stops</span>


                                            </div> : ''}
                                        </div>
                                        <div className="col-2 relative">
                                            <p className="price" >Price: <b> {r.price.total}</b> </p>
                                            <p className="currency">  <b>{this.props.currency} </b>  Per 1</p></div>
                                        <div className="col-2 relative">
                                            <button type="button"
                                                className="btn btn-info bookAFlight waves-effect waves-light blue lighten-1">Book Flight</button>
                                        </div>
                                    </div>
                                    {/*body*/}
                                    <div className="collapsible-body ">
                                        <div className="row">
                                            <div className="col-8">
                                                {/*outbound info*/}
                                                {r
                                                    .outbound
                                                    .flights
                                                    .map(function (flight, i) {
                                                        return (
                                                            <div key={i} className="info">

                                                                <div className="row">
                                                                    <span className="col-4">   <b>{flight.origin.airport}</b></span>
                                                                    <i className="material-icons fa-rotate-90 col-2">airplanemode_active</i>
                                                                    <span className="col s4">  <b> {flight.destination.airport}</b></span>
                                                                </div>

                                                                <div className="row">
                                                                    <span className="hideMobile col-3 m3">Depart:</span>
                                                                    <span className="dateInfo col-6 m5">{splitDate(flight.departs_at)}</span>
                                                                    <span className="col-5 m4"> {splitHour(flight.departs_at)}</span>
                                                                </div>
                                                                <div className="row">
                                                                    <span className="hideMobile col-3  m3">Arrive:</span>
                                                                    <span className="dateInfo col s6  m5">{splitDate(flight.arrives_at)}</span>
                                                                    <span className="col-5 m4">{splitHour(flight.arrives_at)}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                {r.outbound.flights.length - 1 === 1 ?
                                                    <p className="connectionTime">
                                                        Connection Time:  {calcFlightTime('local', r.outbound.flights[0].arrives_at, r.outbound.flights[r.outbound.flights.length - 1].departs_at)}

                                                    </p> : ''}

                                                <hr></hr>
                                                {/*inbound info*/}

                                                {r
                                                    .inbound
                                                    .flights
                                                    .map(function (flight, i) {
                                                        return (
                                                            <div key={i}>
                                                                <div className="row">
                                                                    <span className="col-4"> <b> {flight.origin.airport}</b></span>
                                                                    <i className="material-icons fa-rotate-270 col-2">airplanemode_active</i>
                                                                    <span className="col-4">   <b>{flight.destination.airport}</b></span>
                                                                </div>



                                                                <div className="row">
                                                                    <span className="hideMobile col-3 m3">Depart:</span>
                                                                    <span className="dateInfo col-6 m5">{splitDate(flight.departs_at)}</span>
                                                                    <span className="col-5 m4"> {splitHour(flight.departs_at)}</span>
                                                                </div>
                                                                <div className="row">
                                                                    <span className="hideMobile col-3  m3">Arrive:</span>
                                                                    <span className="dateInfo col-6  m5">{splitDate(flight.arrives_at)}</span>
                                                                    <span className="col-5 m4">{splitHour(flight.arrives_at)}</span>
                                                                </div>

                                                            </div>
                                                        );
                                                    })}
                                                {r.inbound.flights.length - 1 === 1 ?
                                                    <p className="connectionTime">
                                                        Connection Time: {calcFlightTime('local', r.inbound.flights[0].arrives_at, r.inbound.flights[r.inbound.flights.length - 1].departs_at)}

                                                    </p> : ''}

                                            </div>
                                            <div className="col-4 left-align otherInfo">
                                                <p>
                                                    Seats Remaining:
                                                        <b>{r.outbound.flights[0].booking_info.seats_remaining}</b>
                                                </p>
                                                {r.outbound.flights[0].origin.terminal ? <p>
                                                    Terminal:
                                                        <b>{r.outbound.flights[0].origin.terminal}</b>
                                                </p> : ""}
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
                                                Refundable:   <b>{result.fare.restrictions.refundable ? 'Yes' : 'No'}</b>
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
        token: state.amadeusReducer.token,
        results: state.reducer.results,
        timezone: state.reducer.timezone,
        currency: state.reducer.currency,
        terminal: state.reducer.terminal,
        date: state.reducer.date,
        return_date: state.reducer.return_date,
        error: state.reducer.error,
        budget: state.reducer.budget,
        direct: state.reducer.direct,
        terminalDest: state.reducer.terminalDest,
        resultsNumber: state.reducer.resultsNumber
    };
}
function mapDispatchToProps(dispatch) {
    return {
        
        INIT_AMADEUS: (access_token) => {
            //change rout to results with new parameters
            const action = {
                type: 'INIT_AMADEUS',
                data: access_token
            };
            dispatch(action);
        },
        SET_RESULTS: (type, data) => {

            const action = {
                type: type,
                data: data
            };
            dispatch(action);

        },
        TIMEZONE: (terminal, terminalDest) => {
            axios
                .get('./data/timeZoneByAirports.json', {})
                .then(function (response) {
                    var timezone = {};
                    response
                        .data
                        .forEach(function (timeZone) {
                            if (timeZone.code === terminal) {
                                timezone['origin_timezone'] = timeZone.offset.gmt
                            }
                            if (timeZone.code === terminalDest) {
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