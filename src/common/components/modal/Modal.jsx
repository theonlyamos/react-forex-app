import React, { PureComponent } from 'react';
import { SOCKET_CLOSED, EDIT_EVENT, UPDATE_RESULTS } from './types';
import SocketClosedModal from './modals/socket-closed/SocketClosedModal';
import EditEventModal from './modals/edit-event';
import UpdateResultModal from './modals/update-result';

class Modal extends PureComponent {
  render() {
    const { type, content, onClose = () => void 0 } = this.props;

    switch (type) {
      case SOCKET_CLOSED:
        return <SocketClosedModal content={content} onClose={onClose} />;
      case EDIT_EVENT:
        return <EditEventModal onClose={onClose} />;
      case UPDATE_RESULTS:
        return <UpdateResultModal />;
      default:
        return <div />;
    }
  }
}

export default Modal;
