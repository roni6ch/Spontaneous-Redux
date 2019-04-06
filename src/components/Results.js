import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import M from 'materialize-css';
import './results.css';
import { AmadeusApi } from './Amadeus';
import { MDBDataTable } from 'mdbreact';


function splitHour(date) {
    if (date !== null && date !== undefined) {
        return date.split('T')[1];
    }
}
function timeDifference(date1, date2) {
    var difference = date1.getTime() - date2.getTime();

    var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
    difference -= daysDifference * 1000 * 60 * 60 * 24

    var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
    difference -= hoursDifference * 1000 * 60 * 60

    var minutesDifference = Math.floor(difference / 1000 / 60);
    difference -= minutesDifference * 1000 * 60

    if (daysDifference > 0)
        return daysDifference + ' days ' + hoursDifference + ' hours ' + minutesDifference + ' minutes ';
    else
        return hoursDifference + ' hours ' + minutesDifference + ' minutes '
}
function calcDuration(duration, duration2) {
    var days = Number(duration.split("D")[0]) > 0 ? Number(duration.split("D")[0]) : "";
    var hours = Number(duration.split("T")[1].split("H")[0]) > 0 ? Number(duration.split("T")[1].split("H")[0]) : "";
    var minuts = Number(duration.split("T")[1].split("H")[1].split("M")[0]) > 0 ? Number(duration.split("T")[1].split("H")[1].split("M")[0]) : "";

    var days2 = Number(duration2.split("D")[0]) > 0 ? Number(duration2.split("D")[0]) : "";
    var hours2 = Number(duration2.split("T")[1].split("H")[0]) > 0 ? Number(duration2.split("T")[1].split("H")[0]) : "";
    var minuts2 = Number(duration2.split("T")[1].split("H")[1].split("M")[0]) > 0 ? Number(duration2.split("T")[1].split("H")[1].split("M")[0]) : "";

    var final = {
        days: days + days2,
        hours: hours + hours2,
        minutes: minuts + minuts2
    }
    if (final.hours >= 24) {
        final.hours = final.hours - 24;
        final.days += 1;
    }
    if (final.minuts >= 60) {
        final.minutes = final.minutes - 60;
        final.hours += 1;
    }
    if (days + days2 > 0)
        return final.days + ' day/s ' + final.hours + ' hour/s ' + final.minutes + ' minute/s ';
    else
        return final.hours + ' hour/s ' + final.minutes + ' minute/s ';
}
class Results extends React.Component {
    constructor() {
        super();
        this.AmadeusApi = AmadeusApi.bind(this);
        this.state = {
            loader: false
        }
    }
    async componentDidMount() {
        this.setState({ loader: true })
        this.props.TIMEZONE(this.props.terminal, this.props.terminalDest);
        let access_token = await this.AmadeusApi();
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
                that.setState({ loader: false })
                //init collapsible currency
                M.Collapsible.init(document.querySelectorAll('.collapsible'));
            })
            .catch(function (error) {
                console.log(error);
                that.props.SET_RESULTS('RESULTS_ERROR', error.response.data.errors[0].detail);
            });

    }

    render() {

        const data = {
            columns: [
                {
                    label: 'Logo',
                    field: 'logo',
                },
                {
                    label: 'From',
                    field: 'from',
                },
                {
                    label: 'To',
                    field: 'to',
                },
                {
                    label: 'Price',
                    field: 'price',
                },
                {
                    label: 'Stops',
                    field: 'stops',
                },
                {
                    label: 'Seats',
                    field: 'seats',
                },
                {
                    label: 'Class',
                    field: 'class',
                },
                {
                    label: 'Book',
                    field: 'book',
                }
            ],
            rows: []
        };

        let results = [];
        this.props.results.forEach((res, i) => {
            res.offerItems.forEach((r, i) => {
                let result = {};
                result.logo = <img src={`http://pics.avs.io/100/30/${r.services[0].segments[0].flightSegment.operating.carrierCode}.png`} alt="logo" />;
                result.from = r.services[0].segments[0].flightSegment.departure.iataCode;
                result.to = r.services[0].segments[r.services[0].segments.length - 1].flightSegment.arrival.iataCode;
                result.price = r.price.total;
                result.stops = r.services[0].segments.length - 1;
                result.seats = r.services[0].segments[0].pricingDetailPerAdult.availability;
                result.class = r.services[0].segments[0].pricingDetailPerAdult.travelClass;
                result.book = <button type="button" className="btn btn-sm btn-info bookAFlight waves-effect waves-light blue lighten-1">Book Flight</button>;
                results.push(result);
            });
        });
        data.rows = results;

        if (this.props.error !== "")
            return <div className="error red">   Error : {this.props.error}</div>
        else if ((this.props.results.length === 0 && this.props.error === "") || this.state.loader)
            return <div className="resultsWrapper">
                <div className="spinner">
                    <div className="double-bounce1"></div>
                    <div className="double-bounce2"></div>
                </div>
            </div>
        else return <div className="resultsWrapper">
           {/* <MDBDataTable striped bordered small data={data} />
*/}
            <div className="row">
                {this.props.results.map((result, index) => {
                    return (result.offerItems.map((r, i) => {
                        return (
                            <ul className="collapsible col-12 z-depth-3" key={index}>
                                <li id={result.id}>
                                    <div className="collapsible-header infoBody row">

                                        {/* from */}
                                        <p className="col-12 col-md-2">
                                            <img
                                                src={`http://pics.avs.io/100/30/${r.services[0].segments[0].flightSegment.operating.carrierCode}.png`}
                                                alt='logo' />
                                        </p>
                                        <div className="col-12 col-md-4 relative">
                                            {r.services[0].segments.map((seg, i) => {
                                                return <div key={i} className="iataCode">
                                                    <span>
                                                        <b>{seg.flightSegment.departure.iataCode}</b>
                                                    </span>
                                                    <span>
                                                        {splitHour(seg.flightSegment.departure.at)}
                                                    </span>

                                                </div>
                                            })}

                                            <div className="timeAndstops">
                                                <i className="material-icons">alarm</i>
                                                <span>  Flight Time: {calcDuration(r.services[0].segments[0].flightSegment.duration, r.services[0].segments[1].flightSegment.duration)}</span>
                                            </div>
                                        </div>
                                        <div className="col-1 relative">
                                            {r.services[0].segments.map((seg, i) => {
                                                return <div key={i}>
                                                    <i className="material-icons fa-rotate-90">airplanemode_active</i>
                                                </div>
                                            })}
                                        </div>
                                        {/* to */}
                                        <div className="col-12 col-md-4 relative">
                                            {r.services[0].segments.map((seg, i) => {
                                                return <div key={i} className="iataCode">
                                                    <span>
                                                        <b>{seg.flightSegment.arrival.iataCode}</b>
                                                    </span>
                                                    <span>
                                                        {splitHour(seg.flightSegment.arrival.at)}
                                                    </span>
                                                </div>
                                            })}

                                            <div className="timeAndstops">
                                                <i className="material-icons">alarm</i>
                                                <span>  Flight Time: {calcDuration(r.services[0].segments[0].flightSegment.duration, r.services[0].segments[1].flightSegment.duration)}</span>
                                            </div>
                                        </div>
                                        <div className="col-2 relative priceAbs stamp">
                                            <span className="price" ><b>{r.price.total} {this.props.currency}</b> </span>

                                        </div>



                                        {r.services[0].segments.length === 2 ? <div className="timeAndstops">
                                            <i className="material-icons">alarm</i>
                                            <span>  Connection Time: <b>{timeDifference(new Date(r.services[0].segments[1].flightSegment.departure.at), new Date(r.services[0].segments[0].flightSegment.arrival.at))}</b></span>
                                            <span style={{ display: 'block' }}>{r.services[0].segments.length - 1} Stops</span>
                                        </div> : ''}

                                    </div>
                                    <hr />
                                    <div className="collapsible-header infoBody row">
                                        {/* from (return) */}
                                        <p className="col-12 col-md-2 companyLogo " >
                                            <img
                                                src={`http://pics.avs.io/100/30/${r.services[1].segments[0].flightSegment.operating.carrierCode}.png`}
                                                alt='logo' />
                                        </p>
                                        <div className="col-12 col-md-4 relative">
                                            {r.services[1].segments.map((seg, i) => {
                                                return <div key={i}>
                                                    <span>
                                                        <b>{seg.flightSegment.departure.iataCode}</b>
                                                    </span>
                                                    <span>
                                                        {splitHour(seg.flightSegment.departure.at)}
                                                    </span>
                                                </div>
                                            })}


                                            <div className="timeAndstops">
                                                <i className="material-icons">alarm</i>
                                                <span>  Flight Time: {calcDuration(r.services[1].segments[0].flightSegment.duration, r.services[1].segments[1].flightSegment.duration)}</span>
                                            </div>
                                        </div>
                                        <div className="col-1 relative">
                                            {r.services[0].segments.map((seg, i) => {
                                                return <div key={i}>
                                                    <i className="material-icons fa-rotate-90">airplanemode_active</i>
                                                </div>
                                            })}
                                        </div>
                                        {/* to (return) */}
                                        <div className="col-12 col-md-4 relative">
                                            {r.services[1].segments.map((seg, i) => {
                                                return <div key={i}>
                                                    <span>
                                                        <b>{seg.flightSegment.arrival.iataCode}</b>
                                                    </span>
                                                    <span>
                                                        {splitHour(seg.flightSegment.arrival.at)}
                                                    </span>
                                                </div>
                                            })}
                                            <div className="timeAndstops">
                                                <i className="material-icons">alarm</i>
                                                <span>  Flight Time: {calcDuration(r.services[1].segments[0].flightSegment.duration, r.services[1].segments[1].flightSegment.duration)}</span>
                                            </div>
                                        </div>


                                        {r.services[1].segments.length === 2 ? <div className="timeAndstops">
                                            <i className="material-icons">alarm</i>
                                            <span>  Connection Time: <b>{timeDifference(new Date(r.services[0].segments[1].flightSegment.departure.at), new Date(r.services[0].segments[0].flightSegment.arrival.at))}</b></span>
                                            <span style={{ display: 'block' }}>{r.services[0].segments.length - 1} Stops</span>
                                        </div> : ''}


                                    </div>
                                    {/*body*/}
                                    <div className="collapsible-body">
                                        <hr />
                                        <div className="row infoBody ">
                                            {r.services.map((service, ind) => {
                                                return service.segments.map((seg, i) => {

                                                    return <React.Fragment  key={"key-" + i}>
                                                        <div className="col-12 col-md-2">
                                                            <p className="companyLogo  ">
                                                                <img src={`http://pics.avs.io/100/30/${seg.flightSegment.operating.carrierCode}.png`} alt='logo' />
                                                            </p>
                                                        </div>
                                                        <div className="col-12 col-md-4" key={i}>
                                                            <p>Departure:  <b>{seg.flightSegment.departure.iataCode}</b>,
                                                    {seg.flightSegment.departure.terminal ? ` Terminal: ${seg.flightSegment.departure.terminal}` : ""}
                                                            </p>
                                                            <p>Arrival:  <b>{seg.flightSegment.arrival.iataCode}</b>,
                                                    {seg.flightSegment.arrival.terminal ? ` Terminal: ${seg.flightSegment.arrival.terminal}` : ""}
                                                            </p>
                                                            <p>Seats Remaining: <b>{seg.pricingDetailPerAdult.availability}</b> </p>
                                                            <p>Fare Class:   <b>{seg.pricingDetailPerAdult.fareClass}</b>  </p>
                                                            <p>Travel Class: <b>{seg.pricingDetailPerAdult.travelClass}</b> </p>
                                                            <p>Flight Number:  <b>{seg.flightSegment.number}</b></p>
                                                            <p>{seg.flightSegment.aircraft ? `Aircraft: ${seg.flightSegment.aircraft.code}` : ""}</p>
                                                            <hr />
                                                        </div></React.Fragment>
                                                })
                                            })}

                                            <div className="col-6 col-md-9 text-left">
                                                <p>
                                                    Total:
                                                        <b>{r.price.total}</b>
                                                </p>
                                                {r.price.totalTaxes ? <p>
                                                    Total Taxes:
                                                        <b>{r.price.totalTaxes}</b>
                                                </p> : ""}
                                            </div>
                                            <div className="col-6 col-md-3 relative">
                                                <button type="button" className="btn btn-info bookAFlight waves-effect waves-light blue lighten-1">Book Flight</button>
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