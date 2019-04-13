import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './results.css';
import { AmadeusApi } from './Amadeus';
import { MDBDataTable } from 'mdbreact';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter } from 'mdbreact';
import _ from 'lodash';



function splitHour(date) {
    if (date !== null && date !== undefined) {
        var dateVal = date.split('T')[1];
        dateVal = dateVal.split(':');
        return dateVal[0] + ":" + dateVal[1];
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
        return daysDifference + ' d ' + hoursDifference + ' h ' + minutesDifference + ' m ';
    else
        return hoursDifference + ' h ' + minutesDifference + ' m '
}
function calcDuration(duration, duration2 = "") {
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
        return final.days + ' d ' + final.hours + ' h ' + final.minutes + ' m ';
    else
        return final.hours + ' h ' + final.minutes + ' m ';
}
function calcFlightDuration(duration) {
    var days = Number(duration.split("D")[0]) > 0 ? Number(duration.split("D")[0]) : "";
    var hours = Number(duration.split("T")[1].split("H")[0]) > 0 ? Number(duration.split("T")[1].split("H")[0]) : "";
    var minutes = Number(duration.split("T")[1].split("H")[1].split("M")[0]) > 0 ? Number(duration.split("T")[1].split("H")[1].split("M")[0]) : "";
    if (days > 0)
        return days + 'd ' + hours + 'h ' + minutes + 'm ';
    else
        return hours + 'h ' + minutes + 'm ';
}
function calcTotalFlightDuration(duration){
    var days = Number(duration.split("D")[0]) > 0 ? Number(duration.split("D")[0]) : "";
    var hours = Number(duration.split("T")[1].split("H")[0]) > 0 ? Number(duration.split("T")[1].split("H")[0]) : "";
    var minutes = Number(duration.split("T")[1].split("H")[1].split("M")[0]) > 0 ? Number(duration.split("T")[1].split("H")[1].split("M")[0]) : "";
    return Number(days) * 24 * 60 + Number(hours) * 60 + Number(minutes);
}
var currency =  {
       "USD":"$",
      "EUR" : "€",
      "ILS" : "₪"
    };
  
class Results extends React.Component {
    constructor() {
        super();
        this.AmadeusApi = AmadeusApi.bind(this);
        this.state = {
            loader: false,
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
        //const url = `https://test.api.amadeus.com/v1/shopping/flight-offers?origin=${this.props.terminal}&destination=${this.props.terminalDest}&maxPrice=${this.props.budget}&currency=${this.props.currency}&nonStop=${this.props.direct}&departureDate=${this.props.date}&returnDate=${this.props.return_date}`;
        const url = './data/fakeData.json';
        var that = this;
        axios.get(url, config)
            .then(function (response) {
                console.log(response.data.data);
                that.props.SET_RESULTS('SET_RESULTS', response.data.data);
                that.setState({ loader: false })
                //init collapsible currency
                //  M.Collapsible.init(document.querySelectorAll('.collapsible'));
            })
            .catch(function (error) {
                console.log(error);
                that.props.SET_RESULTS('RESULTS_ERROR', error.response.data.errors[0].detail);
            });

    }

    toggle = (nr, result) => () => {
        let modalNumber = 'modal' + nr
        this.setState({
            [modalNumber]: !this.state[modalNumber]
        });
        if (result !== "")
            this.props.SET_FLIGHT(result);
    }

    sort = (sorting) => () => {
      if (sorting === "price"){
      let results = _.orderBy(this.props.results, function(res) {
            return Number(res.offerItems[0].price.total);
        }, ['asc']);
        this.props.SET_RESULTS('SET_RESULTS', results);
      }
      if (sorting === "duration"){
        let results = _.orderBy(this.props.results, function(result) {
                let sum =  _.sumBy(result.offerItems[0].services, function(service) {
                    return _.sumBy(service.segments, function(seg) {
                            return calcTotalFlightDuration(seg.flightSegment.duration);
                    });
                });
                return sum;
          }, ['asc']);
          this.props.SET_RESULTS('SET_RESULTS', results);
        }
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


            <button onClick={this.sort("price")}>Sort by price</button>
            <button onClick={this.sort("duration")}>Sort by duration</button>
            <div className="row">
                {this.props.results.map((result, index) => {
                    return (result.offerItems.map((r, i) => {
                        return (
                            <ul className="collapsible col-12 z-depth-3" key={index} id={result.id} onClick={this.toggle(8, result)}>
                                <li>
                                    <div className="collapsible-header infoBody row">
                                        <p className="col-2 p-0">
                                            <img src={`http://pics.avs.io/100/30/${r.services[0].segments[0].flightSegment.operating.carrierCode}.png`} alt='logo' />
                                        </p>
                                        <div className="col-7">
                                            <div className="iataCode">
                                                {/* departure */}
                                                <span>
                                                    <b>{r.services[0].segments[0].flightSegment.departure.iataCode}</b>
                                                </span>
                                                <span>
                                                    {splitHour(r.services[0].segments[0].flightSegment.departure.at)}
                                                </span>
                                                <span>
                                                    <i className="material-icons fa-rotate-90">airplanemode_active</i>
                                                </span>
                                                {/* arrival */}
                                                <span>
                                                    <b>{r.services[0].segments[r.services[0].segments.length - 1].flightSegment.arrival.iataCode}</b>
                                                </span>
                                                <span>
                                                    {splitHour(r.services[0].segments[r.services[0].segments.length - 1].flightSegment.arrival.at)}
                                                </span>

                                                <div className="timeAndstops">
                                                    <span>{calcDuration(r.services[0].segments[0].flightSegment.duration, r.services[0].segments[1].flightSegment.duration)}</span>
                                                    <span> | </span>
                                                    <span> {r.services[0].segments.length > 1 ? `${r.services[0].segments.length - 1} stops ${r.services[0].segments[0].flightSegment.arrival.iataCode}` : <span className="direct">Direct Flight!</span>} </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <p>{r.services[0].segments[0].pricingDetailPerAdult.availability} deals</p>
                                            <b>{r.price.total} {this.props.currency}</b>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="collapsible-header infoBody row">
                                        <p className="col-2 p-0">
                                            <img src={`http://pics.avs.io/100/30/${r.services[r.services.length - 1].segments[r.services[r.services.length - 1].segments.length - 1].flightSegment.operating.carrierCode}.png`} alt='logo' />
                                        </p>
                                        <div className="col-7">
                                            {/* departure */}
                                            <div className="iataCode">
                                                <span>
                                                    <b>{r.services[r.services.length - 1].segments[0].flightSegment.departure.iataCode}</b>
                                                </span>
                                                <span>
                                                    {splitHour(r.services[r.services.length - 1].segments[0].flightSegment.departure.at)}
                                                </span>
                                                <span>
                                                    <i className="material-icons fa-rotate-90">airplanemode_active</i>
                                                </span>

                                                {/* arrival */}
                                                <span>
                                                    <b>{r.services[r.services.length - 1].segments[r.services[r.services.length - 1].segments.length - 1].flightSegment.arrival.iataCode}</b>
                                                </span>
                                                <span>
                                                    {splitHour(r.services[r.services.length - 1].segments[r.services[r.services.length - 1].segments.length - 1].flightSegment.arrival.at)}
                                                </span>
                                                <div className="timeAndstops">
                                                    <span>{calcDuration(r.services[r.services.length - 1].segments[0].flightSegment.duration, r.services[r.services.length - 1].segments.length > 1 ? r.services[r.services.length - 1].segments[1].flightSegment.duration : "0DT0H0M")}</span>
                                                    <span> | </span>
                                                    <span> {r.services[r.services.length - 1].segments.length > 1 ? `${r.services[r.services.length - 1].segments.length - 1} stops ${r.services[r.services.length - 1].segments[0].flightSegment.arrival.iataCode}` : <span className="direct">Direct Flight!</span>} </span>
                                                </div>
                                            </div>


                                        </div>
                                        <div className="col-3 p-0">
                                            <button type="button" className="btn btn-info bookAFlight waves-effect waves-light blue lighten-1">Book Flight</button>
                                        </div>
                                    </div>

                                </li>
                            </ul>)
                    }))
                })}

            </div>
            {/*MODAL*/}
            <MDBContainer>
                <MDBModal isOpen={this.state.modal8} toggle={this.toggle(8, "")} fullHeight position="right">
                    <MDBModalHeader toggle={this.toggle(8, "")}>Book your ticket -    <b>{this.props.result.offerItems.length > 0 ? this.props.result.offerItems[0].price.total : ""}{currency[this.props.currency]}</b></MDBModalHeader>
                    <MDBModalBody className="flight">
                        {typeof (this.props.result.offerItems) !== undefined ? this.props.result.offerItems.map((offers, index) => {
                            return offers.services.map((service, ind) => {
                                return service.segments.map((seg, i) => {

                                    return <React.Fragment key={"key-" + i}>
                                        <div className="flightWrapper">
                                            {i === 0 && ind === 0 ? <div className="triangle triangle-1"><span>Outbound</span></div> : ""}
                                            {i === 0 && ind === 1 ? <div className="triangle triangle-1"><span>Inbound</span></div> : ""}
                                            <div className="col-12">
                                                <p className="companyLogo">
                                                    <img src={`http://pics.avs.io/100/30/${seg.flightSegment.operating.carrierCode}.png`} alt='logo' />
                                                </p>
                                            </div>
                                            <div className="col-12 flightDetails" key={i}>
                                                <p>
                                                    {typeof (seg.flightSegment.departure.at) !== undefined ? <span><b>{splitHour(seg.flightSegment.departure.at)}</b> | </span> : ""}
                                                    {typeof (seg.flightSegment.departure.iataCode) !== undefined ? <span> Departue: <b>{seg.flightSegment.departure.iataCode}</b>, </span> : ""}
                                                    {typeof (seg.flightSegment.departure.terminal) !== undefined ? <span> Terminal: <b>{seg.flightSegment.departure.terminal}</b></span> : ""}
                                                </p>
                                                <p>
                                                    {typeof (seg.flightSegment.arrival.at) !== undefined ? <span><b>{splitHour(seg.flightSegment.arrival.at)}</b> | </span> : ""}
                                                    {typeof (seg.flightSegment.arrival.iataCode) !== undefined ? <span> Arrival: <b>{seg.flightSegment.arrival.iataCode}</b>, </span> : ""}
                                                    {typeof (seg.flightSegment.arrival.terminal) !== undefined ? <span> Terminal: <b>{seg.flightSegment.arrival.terminal}</b></span> : ""}
                                                </p>
                                                <p>
                                                    {typeof (seg.flightSegment.duration) !== undefined ? <span> Duration: <b>{calcFlightDuration(seg.flightSegment.duration)}</b>, </span> : ""}
                                                    {typeof (seg.pricingDetailPerAdult.availability) !== undefined ? <span> Seats: <b>{seg.pricingDetailPerAdult.availability}</b>, </span> : ""}
                                                    {typeof (seg.pricingDetailPerAdult.travelClass) !== undefined ? <span className="travelClass"> Class: <b>{seg.pricingDetailPerAdult.travelClass}</b></span> : ""}

                                                </p>
                                                <p>
                                                    {typeof (seg.flightSegment.number) !== undefined ? <span> Flight Number: <b>{seg.flightSegment.number}</b>, </span> : ""}
                                                    {typeof (seg.flightSegment.aircraft.code) !== undefined ? <span> Aircraft Code: <b>{seg.flightSegment.aircraft.code}</b> </span> : ""}
                                                </p>
                                                <hr />
                                            </div></div></React.Fragment>
                                })
                            })
                        }
                        ) : ""}

                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="secondary" onClick={this.toggle(8, "")}>Close</MDBBtn>
                        <MDBBtn color="primary">Book Flight!</MDBBtn>
                    </MDBModalFooter>
                </MDBModal>
            </MDBContainer>

        </div>
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
        resultsNumber: state.reducer.resultsNumber,
        result: state.reducer.result
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
        SET_FLIGHT: (data) => {

            const action = {
                type: 'SET_FLIGHT',
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