export const types = {
  UPDATE_EVENT_LIST: 'UPDATE_EVENT_LIST',
  UPDATE_SUBSCRIBE_EVENT: 'UPDATE_SUBSCRIBE_EVENT',
  UPDATE_RUNTIME_CALCULATION_EVENT: 'UPDATE_RUNTIME_CALCULATION_EVENT',
  UPDATE_CHART: 'UPDATE_CHART',
};

const updateEventList = eventList => ({
  type: types.UPDATE_EVENT_LIST,
  payload: eventList,
});

const updateSubscribeEvent = event => ({
  type: types.UPDATE_SUBSCRIBE_EVENT,
  payload: event,
});

const updateRuntimeCalculationEvent = event => ({
  type: types.UPDATE_RUNTIME_CALCULATION_EVENT,
  payload: event,
});

const updateForexEventChart = data => ({
  type: types.UPDATE_CHART,
  payload: data,
});

export const actions = {
  updateEventList,
  updateSubscribeEvent,
  updateRuntimeCalculationEvent,
  updateForexEventChart,
};
