import {combineReducers ,createStore} from 'redux';

const initialState = {
    terminals: [],
    terminal: "TLV",
    terminalDest : "LAX",
    currency: "USD",
    date: "2018-09-01",
    return_date : "2018-09-05",
    budget: 2000,
    submit: false,
    error : "",
    results: [],
    resultsNumber : 10,
    timezone: {
        'origin_timezone': 0,
        'destination_timezone': 0
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INIT':
            return Object.assign({}, state, {submit: action.data});
        case 'INIT_RESULTS':
        return Object.assign({}, state, {results: [] , error : ""});
        case 'RESULTS_ERROR':
        return Object.assign({}, state, {error:  action.data});
       
        case 'GET_TERMINALS':
            return Object.assign({}, state, {terminals: action.data});
        case 'SET_TERMINAL':
            return Object.assign({}, state, {terminal: action.data.split("-")[0].trim()});
            case  'SET_TERMINAL_DEST':
             return Object.assign({}, state, {terminalDest: action.data.split("-")[0].trim()});
      case 'SET_RESULTS_NUMBER':
      return Object.assign({}, state, {resultsNumber: action.data});
            case 'SET_CURRENCY':
            return Object.assign({}, state, {currency: action.data});
        case 'SET_BUDGET':
            return Object.assign({}, state, {budget: action.data});
        case 'SET_DATE':
            if (action.dateInput === 'date')
            return Object.assign({}, state, { date: action.data});
            else 
            return Object.assign({}, state, { return_date: action.data});
        case 'SUBMIT':
            if (state.budget !== 0 && state.terminal !== "" &&  state.date !== null && state.return_date !== null) 
                return Object.assign({}, state, {submit: action.data});
            else 
                return state;
            
        case 'SET_RESULTS':
            return Object.assign({}, state, {results: action.data});

        case 'TIMEZONE':
            return Object.assign({}, state, {timezone: action.data});

        default:
            return state
    }
}

const initialState2 = {
    terminals2: [],
}
const searchReducer = (state = initialState2, action) => {
    switch (action.type) {
        case 'CHECK':
            return Object.assign({}, state, {submit: action.data});
        default:
            return state
    }
}
const reducers = combineReducers({
    reducer,
     searchReducer
})
const store = createStore(reducers);

export default store;
