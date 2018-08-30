import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import M from 'materialize-css';
import './results.css';


function splitHour(date) {
  if (date !== null && date !== undefined) {
    var array = date.split('T');
    return array[1];
  }
}
function calcFlightTime(returnFrom, depart, arrive) {
  if (depart !== null && depart !== undefined && arrive !== null && arrive !== undefined) {
    var difference = ((new Date(arrive)) - (new Date(depart)));
    var diff = new Date(difference / (60000) * 1000).toUTCString().split(" ")[4];


    return parseInt(diff.split(":")[1]) + "h:" + diff.split(":")[2] + "m";
  }
}



class Results extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.TIMEZONE();
    this.props.SET_RESULTS();
  }
  render() {
    return <div className="row">

      {this.props.results.map((result, index) => {
        return (result.itineraries.map((r, i) => {
          return (
            <ul className="collapsible col s6 z-depth-3" key={i} >
              {/* li header */}
              <li>

                <div className="collapsible-header">
                  <span >Price: <b>{result.fare.price_per_adult.total_fare}</b> {this.props.currency} Per 1</span>
                  <button type="button" className="btn btn-info bookAFlight">Book
									Flight</button>
                </div>
              </li>

              <li>
                <div className="collapsible-header">
                  {/*outbound */}
                  <p>
                    <img src={`http://pics.avs.io/100/30/${r.outbound.flights[0].operating_airline}.png`} alt='logo' />
                  </p>
                  <p>
                    <span><b>{r.outbound.flights[0].origin.airport}</b></span>
                    <span>{splitHour(r.outbound.flights[0].departs_at)}</span>
                        <i className="material-icons fa-rotate-90">airplanemode_active</i>
                    <span><b>{r.outbound.flights[r.outbound.flights.length - 1].destination.airport}</b></span>
                    <span>{splitHour(r.outbound.flights[r.outbound.flights.length - 1].arrives_at)}</span>
                  </p>

                  <div className="timeAndstops">
                    <i className="material-icons">alarm</i>

                    <p> {calcFlightTime('local', r.outbound.flights[0].arrives_at, r.outbound.flights[r.outbound.flights.length - 1].departs_at)}</p>
                    <p>{r.outbound.flights.length - 1} Stops</p>

                  </div>

                  {/*inbound*/}
                  <p>
                    <span > <b>{r.inbound.flights[0].origin.airport}</b></span>
                    <span>{splitHour(r.inbound.flights[0].departs_at)}</span>
                        <i className="material-icons fa-rotate-270">airplanemode_active</i>
                    <span > <b>{r.inbound.flights[r.inbound.flights.length - 1].destination.airport}</b></span>
                    <span>{splitHour(r.inbound.flights[r.inbound.flights.length - 1].arrives_at)}</span>
                  </p>
                  <div className="timeAndstops">

                    <i className="material-icons">alarm</i>
                    <p> {calcFlightTime('destination', r.inbound.flights[0].arrives_at, r.inbound.flights[r.outbound.flights.length - 1].departs_at)}</p>
                    <p>  <span>{r.inbound.flights.length - 1} Stops</span></p>

                  </div>
                </div>
                {/*body*/}
                <div className="collapsible-body ">
                <div className="row">
                  <div className="col s6">
                    {/*outbound info*/}
                    {r.outbound.flights.map(function (flight, i) {
                      return (<div key={i}>
                        <span > {flight.origin.airport}</span>
                        <span>{splitHour(flight.departs_at)}</span>
                        <i className="material-icons fa-rotate-90">airplanemode_active</i>
                        <span > {flight.destination.airport}</span>
                        <span>{splitHour(flight.arrives_at)}</span>
                      </div>);
                    })}

                    <p className="connectionTime">
                      {calcFlightTime('local', r.outbound.flights[0].arrives_at, r.outbound.flights[r.outbound.flights.length - 1].departs_at)} Connection
						</p>

                    <hr></hr>
                    {/*inbound info*/}

                    {r.inbound.flights.map(function (flight, i) {
                      return (<div key={i}>
                        <span > {flight.origin.airport}</span>
                        <span>{splitHour(flight.departs_at)}</span>
                        <i className="material-icons fa-rotate-270">airplanemode_active</i>
                        <span > {flight.destination.airport}</span>
                        <span>{splitHour(flight.arrives_at)}</span>
                      </div>);
                    })}

                    <p className="connectionTime">
                      {calcFlightTime('local', r.inbound.flights[0].arrives_at, r.inbound.flights[r.inbound.flights.length - 1].departs_at)} Connection
						</p>

                  </div>
                  <div className="col s6 left-align">
                    <p> Seats Remaining: <b>{r.outbound.flights[0].booking_info.seats_remaining}</b></p>
                    <p> Terminal: <b>{r.outbound.flights[0].origin.terminal}</b></p>
                    <p> Flight Number: <b>{r.outbound.flights[0].flight_number}</b></p>
                    <p> Travel Class: <b>{r.outbound.flights[0].booking_info.travel_class}</b></p>
                    <p> Destination: <b>{r.outbound.flights[0].destination.airport}</b></p>
                  </div>

</div>

                </div>
              </li>

            </ul>
          )
        })
        );
      })}
    </div>;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Results);

function mapStateToProps(state) {
  console.log(state);
  return {
    results: state.results,
    timezone: state.timezone,
    currency : state.currency
  };
}
function mapDispatchToProps(dispatch) {
  return {
    SET_RESULTS: () => {
      axios.get('./data/flights.json', {
      })
        .then(function (response) {
          console.log(response.data.results);
          const action = { type: 'SET_RESULTS', data: response.data.results };
          dispatch(action);

          M.Collapsible.init(document.querySelectorAll('.collapsible'));
        })
        .catch(function (error) {
          console.log(error);
        });

    },
    TIMEZONE: () => {
      axios.get('./data/timeZoneByAirports.json', {
      })
        .then(function (response) {
          var timezone = {};
          console.log(response);
          response.data.forEach(function (timeZone) {
            if (timeZone.code === 'TLV') {
              timezone['origin_timezone'] = timeZone.offset.gmt
            }
            if (timeZone.code === 'LAX') {
              timezone['destination_timezone'] = timeZone.offset.gmt
            }
          })

          console.log(timezone);


          const action = { type: 'TIMEZONE', data: timezone };
          dispatch(action);


        })
        .catch(function (error) {
          console.log(error);
        });

    },
  }
}