export const types = {
  SHOW_MODAL: 'SHOW_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
};

const showModal = (type, content) => ({
  type: types.SHOW_MODAL,
  payload: { type, content },
});

const closeModal = () => ({
  type: types.CLOSE_MODAL,
  payload: null,
});

export const actions = {
  showModal,
  closeModal,
};
