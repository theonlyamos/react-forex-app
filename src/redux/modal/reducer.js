import { types } from './actions';

const initialState = {
  type: null,
  content: null,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.SHOW_MODAL:
      return {
        ...state,
        ...payload,
      };
    case types.CLOSE_MODAL:
      return initialState;
    default:
      return state;
  }
};
