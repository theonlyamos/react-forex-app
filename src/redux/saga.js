import { all, fork } from 'redux-saga/effects';
import watchUserActionRequests from './user/saga';
import watchForexActionRequests from './forex/saga';

export default function* rootSaga() {
  yield all([fork(watchUserActionRequests)]);
  yield all([fork(watchForexActionRequests)]);
}
