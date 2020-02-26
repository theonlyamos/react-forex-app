import { call, put, takeLatest } from 'redux-saga/effects';
import { types, actions } from './actions';
import axios from 'axios';

function* fetchUserRequest() {
  try {
    const user = yield call(axios.get('/api/me/profile'));
    yield put(actions.fetchUserSuccess(user));
  } catch (e) {
    yield put(actions.fetchUserFail(e));
  }
}

function* fetchReferralListRequest() {
  try {
    const { data } = yield call(() => axios.get('/api/me/referrals'));
    yield put(actions.fetchReferralListSuccess(data));
  } catch (e) {
    yield put(actions.fetchReferralListFail(e));
  }
}

export default function* watchUserActionRequests() {
  yield takeLatest(types.FETCH_USER_REQUEST, fetchUserRequest);
  yield takeLatest(types.FETCH_REFERRAL_LIST_REQUEST, fetchReferralListRequest);
}
