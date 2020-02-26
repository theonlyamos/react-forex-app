export const types = {
  FETCH_USER_SUCCESS: 'FETCH_USER_SUCCESS',
  FETCH_USER_REQUEST: 'FETCH_USER_REQUEST',
  FETCH_USER_FAIL: 'FETCH_USER_FAIL',
  FETCH_USER_LOGOUT: 'FETCH_USER_LOGOUT',

  UPDATE_USER: 'UPDATE_USER',

  BALANCE_UPDATE: 'BALANCE_UPDATE',

  FETCH_REFERRAL_LIST_REQUEST: 'FETCH_REFERRAL_LIST_REQUEST',
  FETCH_REFERRAL_LIST_SUCCESS: 'FETCH_REFERRAL_LIST_SUCCESS',
  FETCH_REFERRAL_LIST_FAIL: 'FETCH_REFERRAL_LIST_FAIL',
};

const userLogout = () => ({
  type: types.FETCH_USER_LOGOUT,
  payload: null,
});

const fetchUserSuccess = user => ({
  type: types.FETCH_USER_SUCCESS,
  payload: user,
});

const fetchUserFail = error => ({
  type: types.FETCH_USER_FAIL,
  error,
});

const fetchReferralListRequest = () => ({
  type: types.FETCH_REFERRAL_LIST_REQUEST,
});

const fetchReferralListSuccess = referralList => ({
  type: types.FETCH_REFERRAL_LIST_SUCCESS,
  payload: referralList,
});

const fetchReferralListFail = error => ({
  type: types.FETCH_REFERRAL_LIST_FAIL,
  error,
});

const updateBalance = balance => ({
  type: types.UPDATE_USER,
  payload: { balance },
});

export const actions = {
  fetchUserSuccess,
  fetchUserFail,
  userLogout,
  updateBalance,
  fetchReferralListRequest,
  fetchReferralListSuccess,
  fetchReferralListFail,
};
