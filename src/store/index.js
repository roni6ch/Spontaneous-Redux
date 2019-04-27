import { combineReducers, createStore } from 'redux';
import moment from 'moment';
let origin_time = moment().format('YYYY-MM-DD');
let destination_time= moment().add(7, 'days').format('YYYY-MM-DD');

const initialState = {
    terminals: [],
    terminal: "TLV",
    terminalDest: "LAX",
    currency: "USD",
    date:origin_time,
    return_date: destination_time,
    budget: 2000,
    submit: false,
    error: "",
    direct: false,
    results: [],
    result:{
        offerItems : []
    },
    resultsNumber: 10,
    timezone: {
        'origin_timezone': '',
        'destination_timezone': ''
    }
}
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INIT':
            return Object.assign({}, state, { submit: action.data , error: ""});
        case 'INIT_RESULTS':
            return Object.assign({}, state, { results: [], error: "" });
        case 'RESULTS_ERROR':
            return Object.assign({}, state, { error: action.data });

        case 'GET_TERMINALS':
            return Object.assign({}, state, { terminals: action.data });
        case 'SET_TERMINALS':
            return Object.assign({}, state, { terminals: action.data });
        case 'SET_TERMINAL':
            return Object.assign({}, state, { terminal: action.data });
        case 'SET_TERMINAL_DEST':
            return Object.assign({}, state, { terminalDest: action.data });
        case 'SET_RESULTS_NUMBER':
            return Object.assign({}, state, { resultsNumber: action.data });
        case 'SET_CURRENCY':
            return Object.assign({}, state, { currency: action.data });
        case 'SET_BUDGET':
            return Object.assign({}, state, { budget: action.data });
        case 'SET_DIRECT':
            return Object.assign({}, state, { direct: action.data });

        case 'SET_DATE':
            if (action.dateInput === 'date')
                return Object.assign({}, state, { date: action.data });
            else
                return Object.assign({}, state, { return_date: action.data });
        case 'SUBMIT':
            if (state.budget !== 0 && state.terminal !== "" && state.date !== null && state.return_date !== null)
                return Object.assign({}, state, { submit: action.data });
            else
                return state;

        case 'SET_RESULTS':
            return Object.assign({}, state, { results: action.data });
        case 'SET_FLIGHT':
            return Object.assign({}, state, { result: action.data });
            
        case 'TIMEZONE':
            return Object.assign({}, state, { timezone: action.data });

        default:
            return state
    }
}

const amadeusState = {
    token: '',
}
const amadeusReducer = (state = amadeusState, action) => {
    switch (action.type) {
        case 'INIT_AMADEUS':
            return Object.assign({}, state, { token: action.data });
        default:
            return state
    }
}
const reducers = combineReducers({
    reducer,
    amadeusReducer
})
const store = createStore(reducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
