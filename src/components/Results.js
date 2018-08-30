import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import M from 'materialize-css';


function splitHour(date) {
  if (date !== null && date !== undefined) {
    var array = date.split('T');
    return array[1];
  }
}
function calcFlightTime(depart, arrive) {
  if (depart !== null && depart !== undefined && arrive !== null && arrive !== undefined) {
    var difference = ((new Date(arrive)) - (new Date(depart)));
    var diff = new Date(difference / (60000) * 1000).toUTCString().split(" ")[4];
    return parseInt(diff.split(":")[1]) + "h:" + diff.split(":")[2] + "m";
  }
}



class Results extends React.Component {
  componentDidMount() {
    this.props.SET_RESULTS();
  }
  render() {
    return <div className="row">
      {this.props.results.map(function (result, index) {
        return (result.itineraries.map(function (r, i) {
          return (
            r.outbound.flights.map(function (flight, inx) {
              return (
                <ul className="collapsible col s6" key={inx} >

                  <li>
                    <div className="collapsible-header">
                      <span >Price:{result.fare.price_per_adult.total_fare}</span></div>
                      </li>
                  <li>
                    <div className="collapsible-header">

                      <p>
                        <i className="material-icons fa-rotate-90">airplanemode_active</i>
                        <img src={`http://pics.avs.io/100/30/${flight.operating_airline}.png`} alt='logo' />
                      </p>
                      <p>
                        <span > {flight.origin.airport}</span>
                        <span>{splitHour(flight.departs_at)}</span>
                        <i className="material-icons ">arrow_forward</i>
                        <span > {flight.destination.airport}</span>
                        <span>{splitHour(flight.arrives_at)}</span>
                      </p>


                      <p className="timeAndstops">
                        <span >
                          <i className="material-icons">alarm</i>
                          {calcFlightTime(flight.departs_at, flight.arrives_at)}
                          <span>{r.outbound.flights.length - 1} Stops</span>
                        </span>
                      </p>
                    </div>

                    <div className="collapsible-body">
                      <p> Seats Remaining:{flight.booking_info.seats_remaining}</p>
                      <p> Terminal:{flight.origin.terminal}</p>
                      <p> Flight Number:{flight.flight_number}</p>
                      <p> Arrives At:{flight.arrives_at}</p>
                      <p> Departs At:{flight.departs_at}</p>
                      <p> Travel Class:{flight.booking_info.travel_class}</p>
                      <p> Destination:{flight.destination.airport}</p>
                    </div>

                  </li>
                 
                </ul>
              )
            })
          )
        })
        );
      })}
      {/*
      <div className="col s6">To
        <ul className="collapsible">
          {this.props.results.map(function (result, index) {
            return (result.itineraries.map(function (r, i) {
              return (
                r.inbound.flights.map(function (flight, inx) {
                  return (<li key={inx}>
                    <div className="collapsible-header">
                      <i className="material-icons fa-rotate-270">airplanemode_active</i>
                      <img src={`http://pics.avs.io/100/30/${flight.operating_airline}.png`} alt='logo' />
                      <span className="badge">
                        {flight.destination.airport}</span>
                      <span className=" badge">Price:{result.fare.price_per_adult.total_fare}</span></div>


                    <div className="collapsible-body">
                      <p> Seats Remaining:{flight.booking_info.seats_remaining}</p>
                      <p> Terminal:{flight.origin.terminal}</p>
                      <p> Flight Number:{flight.origin.flight_number}</p>
                      <p> Arrives At:{flight.arrives_at}</p>
                      <p> Departs At:{flight.departs_at}</p>
                      <p> Travel Class:{flight.booking_info.travel_class}</p>
                      <p> Destination:{flight.destination.airport}</p></div>

                  </li>)
                })
              )
            })
            );
          })}
        </ul>
        </div> */}
    </div>;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Results);

function mapStateToProps(state) {
  return {
    results: state.results
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
  }
}


