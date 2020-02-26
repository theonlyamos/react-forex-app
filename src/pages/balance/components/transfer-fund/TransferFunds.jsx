import React, { Component } from 'react';
import './TransferFunds.css';
import axios from 'axios';

class TransferFunds extends Component {
  constructor(props) {
    super(props);
    this.socket = props.props.socket;
  }

  initialState = {
    transferTo: '',
    transferAmount: '',
    transferPassword: '',
    disabled: true,
  };

  state = this.initialState;

  handleChange = ({ target: { name, value } }) => {
    const { transferTo, transferAmount, transferPassword } = this.state;
    const disabled = !transferTo || !transferAmount || !transferPassword;
    this.setState({ [name]: value, disabled });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { transferTo: to_user_name, transferPassword: password, transferAmount: amount } = this.state;
    axios.post('/api/me/transfer', { to_user_name, password, amount })
    .then( response => {
      let data = response.data;
      alert(data.message);
      this.socket.emit('processBalance', data.data);
      this.socket.emit('transferHistories', data.data);
      this.setState(this.initialState);
    }).catch( error =>{
      let data = error && error.response ? error.response.data : '';
      if(data){
        console.log(data.errors);
      }
    })
  };

  render() {
    const { transferTo, transferAmount, transferPassword, disabled } = this.state;

    return (
      <div className="transfer-funds event-section-content" onSubmit={this.handleSubmit}>
        <div className="input-group">
          <label htmlFor="transfer_to">Username transfer</label>
          <input
            type="text"
            name="transferTo"
            value={transferTo}
            onChange={this.handleChange}
            placeholder="Required"
          />
        </div>
        <div className="input-group">
          <label htmlFor="transfer_amount">Amount</label>
          <input
            type="number"
            name="transferAmount"
            onChange={this.handleChange}
            value={transferAmount}
            placeholder="Required"
            min="0"
          />
        </div>
        <div className="input-group">
          <label htmlFor="transfer_password">Password</label>
          <input
            type="password"
            name="transferPassword"
            onChange={this.handleChange}
            value={transferPassword}
            placeholder="Required"
          />
        </div>
        <div className="input-group">
          <input
            type="submit"
            onClick={this.handleSubmit}
            disabled={disabled}
            value="Transfer"
            className={'btn btn-primary ' + (disabled ? 'disabled' : '')}
          />
        </div>
      </div>
    );
  }
}

export default TransferFunds;
