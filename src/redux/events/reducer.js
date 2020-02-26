import { types } from './actions';

const initialState = {
  incoming: [],
  ongoing: [],
  over: [],
  forex: [],
  history: [],
  chart: {
    tick: 0,
    data: [],
    minPrice: 0,
    maxPrice: 0,
  },
  subscribeEvent: null,
  runtimeCalculationEvent: {
    estimation: null,
    risk: null,
    safe: null,
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.UPDATE_EVENT_LIST:
      const { incoming, ongoing, over, history, forex } = payload;
      return { ...state, incoming, ongoing, over, history, forex };
    case types.UPDATE_SUBSCRIBE_EVENT:
      return { ...state, subscribeEvent: payload };
    case types.UPDATE_RUNTIME_CALCULATION_EVENT:
      return {
        ...state,
        runtimeCalculationEvent: payload || initialState.runtimeCalculationEvent,
      };
    case types.UPDATE_CHART:
      return {
        ...state,
        chart: { ...payload },
      };

    default:
      return state;
  }
};
