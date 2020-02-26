import React, { PureComponent } from 'react';
import Modal from 'react-responsive-modal';
import EditEventForm from './EditEventForm';
import EditForexEventForm from './EditForexEditForm';

import './EditEventModal.css';
import { isMobile } from '../../../../utils/mobile-check.util';

class EditEventModal extends PureComponent {
  constructor(props) {
    super(props);

    this.props.getForexEventSymbols();
  }
  render() {
    const { event, symbols, onClose = () => void 0 } = this.props;

    return (
      <Modal
        open={true}
        onClose={onClose}
        styles={{
          modal: {
            minWidth: isMobile ? '300px' : '500px',
            maxWidth: isMobile ? '300px' : '500px',
            padding: isMobile ? '0' : '1.2rem',
          },
          overlay: { alignItems: 'center', padding: isMobile ? '0' : '1.2rem' },
        }}
      >
        {event && event.type === 'FOREX_EVENT' ? (
          <EditForexEventForm event={event} symbols={symbols} onSubmit={onClose} />
        ) : (
          <EditEventForm event={event} onSubmit={onClose} />
        )}
      </Modal>
    );
  }
}

export default EditEventModal;
