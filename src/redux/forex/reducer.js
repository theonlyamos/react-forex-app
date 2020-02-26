import { types } from './actions';

const initialState = {
  symbols: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.FETCH_FOREX_SYMBOLS_SUCCESS:
      return { ...state, symbols: payload };
    default:
      return state;
  }
};
