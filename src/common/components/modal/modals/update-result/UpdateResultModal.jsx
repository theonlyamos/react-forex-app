import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import SocketService from '../../../../services/socket.service';
import { isMobile } from '../../../../utils/mobile-check.util';

import './UpdateResultModal.css';

class UpdateResultModal extends Component {
  initialState = { candidate: '', refund: '' };
  state = this.initialState;

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  handleClose = () => {
    const { onClose = () => void 0 } = this.props;

    this.setState(this.initialState, () => onClose());
  };

  handleUpdateResult = () => {
    const {
      event: { id, type },
    } = this.props;
    const { candidate, refund } = this.state;
    const results = [candidate].filter(item => Boolean(item));

    SocketService.send('update_results', { id, results, refund, type });
    this.handleClose();
  };

  render() {
    const {
      event: { candidates = [] },
    } = this.props;
    const { candidate, refund } = this.state;

    return (
      <Modal
        open={true}
        showCloseIcon={false}
        little
        onClose={this.handleClose}
        styles={{
          modal: {
            minWidth: isMobile ? '300px' : '500px',
            maxWidth: isMobile ? '300px' : '500px',
            padding: 0,
          },
        }}
      >
        <div className="event-section-inner">
          <div className="event-section-header">Update Results for this Event</div>
          <div className="input-group">
            <label>Winner</label>
            <select value={candidate} name="candidate" onChange={this.handleChange}>
              <option value="">None</option>
              {candidates.map(({ id, name }) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label>Refund</label>
            <select value={refund} name="refund" onChange={this.handleChange}>
              <option value="">None</option>
              <option value="admin">Admin</option>
              <option value="clients">Clients</option>
            </select>
          </div>
        </div>
        <div className="event-section-header tab bottom">
          <span onClick={this.handleClose}>Cancel</span>
          <span onClick={this.handleUpdateResult} className="active">
            Set Results
          </span>
        </div>
      </Modal>
    );
  }
}

export default UpdateResultModal;
