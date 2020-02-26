import { call, put, takeLatest, select } from 'redux-saga/effects';
import { types, actions } from './actions';
import axios from 'axios';

function* fetchForexSymbolsRequest() {
  try {
    const {
      forex: { symbols },
    } = yield select();

    if (symbols) {
      return yield put(actions.fetchForexSymbolsSuccess(symbols));
    }

    const { data } = yield call(() => axios.get('/api/forex/symbols'));
    yield put(actions.fetchForexSymbolsSuccess(data));
  } catch (e) {
    console.log(e);
    yield put(actions.fetchForexSymbolsFail(e));
  }
}

export default function* watchUserActionRequests() {
  yield takeLatest(types.FETCH_FOREX_SYMBOLS_REQUEST, fetchForexSymbolsRequest);
}
