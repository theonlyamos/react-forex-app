import React, { PureComponent } from 'react';
import axios from 'axios';

class WithdrawAffiliate extends PureComponent {
  constructor(props){
    super(props);

    this.socket = props.socket;
  }
  initialState = {
    type: 'Affiliate',
    amount: '',
    password: '',
    disabled: true,
  }

  state = this.initialState;

  handleChange = ({ target: { name, value } }) => {
    const { amount, password }= this.state;
    const disabled = !amount || !password;
    this.setState({ [name]: value, disabled });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { amount, password, type } = this.state;
    axios.post('/api/me/withdraw-affiliate', { amount, password, type })
    .then( response => {
      let data = response.data;
      alert(data.message);
      this.socket.emit('processBalance', { to_user_id: data.data.user_id, from_user_id: null });
      this.socket.emit('manageFundsHistories', data.data);
      this.setState(this.initialState);
    })
    .catch( error => {
      let data = error.response.data;
      console.log(data.errors);
    })
  }

  render() {
    const { amount, password, disabled } = this.state;
    return (
      <div className="event-section-inner small affiliates">
        <form onSubmit={ this.handleSubmit }>
          <div className="input-group">
            <label htmlFor="pasamountsword">Amount</label>
            <input
              type="number"
              name="amount"
              onChange={this.handleChange}
              value={amount}
              placeholder="Required"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              onChange={this.handleChange}
              value={password}
              placeholder="Required"
            />
          </div>
          <div className="input-group">
            <input
              type="submit"
              onClick={this.handleSubmit}
              disabled={disabled}
              value="Submit"
              className={'btn btn-primary ' + (disabled ? 'disabled' : '')}
            />
          </div>
        </form>
      </div>
    );
  }
}

export default WithdrawAffiliate;
