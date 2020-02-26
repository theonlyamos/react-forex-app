import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-responsive-modal';
import { isMobile } from '../../../../utils/mobile-check.util';

import './SocketClosedModal.css';

const SocketClosedModal = ({ content }) => (
  <Modal
    open={true}
    showCloseIcon={false}
    little
    onClose={() => void 0}
    styles={{ overlay: { zIndex: 0 }, modal: { minWidth: isMobile ? '300px' : '500px' } }}
  >
    <div className="red">{content}</div>
  </Modal>
);

SocketClosedModal.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default SocketClosedModal;
