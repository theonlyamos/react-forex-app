import { types } from './actions';

const initialState = {
  account_type: null,
  balance: 0,
  id: null,
  email: null,
  referral_token: null,
  referrer_uid: null,
  username: null,
  referralList: [],
  affiliate_balance: 0,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.FETCH_USER_SUCCESS:
      return {
        ...state,
        ...payload,
      };
    case types.FETCH_USER_FAIL:
    case types.FETCH_USER_LOGOUT:
      return {
        ...initialState,
      };
    case types.UPDATE_USER:
      return {
        ...state,
        ...payload,
      };

    case types.FETCH_REFERRAL_LIST_SUCCESS:
      return {
        ...state,
        referralList: [...payload],
      };

    default:
      return state;
  }
};
