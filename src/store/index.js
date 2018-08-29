import { createStore } from 'redux';

const initialState = {
    terminals: [],
    terminal: "",
    currency: "",
    date: null,
    budget: 0
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_TERMINALS':
            return Object.assign({}, state, { terminals: action.data });
        case 'SET_TERMINAL':
            return Object.assign({}, state, { terminal: action.data });
        case 'SET_CURRENCY':
            return Object.assign({}, state, { currency: action.data });
        case 'SET_BUDGET':
            return Object.assign({}, state, { budget: action.data });
        case 'SET_DATE':
            return Object.assign({}, state, { date: action.data.toLocaleDateString() });
        case 'SUBMIT':
            //switch router



        default: return state
    }
}

const store = createStore(reducer);

export default store;
