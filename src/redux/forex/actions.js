export const types = {
  FETCH_FOREX_SYMBOLS_REQUEST: 'FETCH_FOREX_SYMBOLS_REQUEST',
  FETCH_FOREX_SYMBOLS_SUCCESS: 'FETCH_FOREX_SYMBOLS_SUCCESS',
  FETCH_FOREX_SYMBOLS_FAIL: 'FETCH_FOREX_SYMBOLS_FAIL',
};

const fetchForexSymbolsRequest = () => ({
  type: types.FETCH_FOREX_SYMBOLS_REQUEST,
});

const fetchForexSymbolsSuccess = symbols => ({
  type: types.FETCH_FOREX_SYMBOLS_SUCCESS,
  payload: symbols,
});
const fetchForexSymbolsFail = error => ({
  type: types.FETCH_FOREX_SYMBOLS_FAIL,
  payload: error,
});

export const actions = {
  fetchForexSymbolsRequest,
  fetchForexSymbolsSuccess,
  fetchForexSymbolsFail,
};
