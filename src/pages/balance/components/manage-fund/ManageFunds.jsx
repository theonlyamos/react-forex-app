import React, { PureComponent } from 'react';
import axios from 'axios';

class ManageFunds extends PureComponent {
  constructor(props) {
    super(props);

    this.socket = props.props.socket;
    this.socket.on('updatePayments', function(data){
      if(data){
        this.fetchPayments();
      }
    }.bind(this));
  }

  initialState = {
    type: 'Deposit',
    payment_index: '',
    credit_number: '',
    credit_name: '',
    payment_address: '',
    country: '',
    amount: '',
    password: '',
    disabled: true,
    payment_methods: '',
    payment_info: '',
    transaction_ID: '',
  };

  state = this.initialState;

  handleChange = ({ target: { name, value } }) => {
    const { credit_number, credit_name, amount, password, payment_methods, transaction_ID }= this.state;
    const disabled = !credit_number || !credit_name || !amount || !password || !transaction_ID;
    this.setState({ [name]: value, disabled });
    if(name === 'payment_index'){
      this.setState({ payment_info: payment_methods[value] })
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { type, payment_index, credit_number, credit_name, payment_address, country, amount, password, payment_methods, transaction_ID } = this.state;
    const payment_id = payment_methods[payment_index].id
    axios.post('/api/me/transactions', { type, payment_id, credit_number, credit_name, payment_address, country, amount, password, transaction_ID })
    .then( response => {
      let data = response.data;
      alert(data.message);
      this.socket.emit('processBalance', { to_user_id: null, from_user_id: data.data.user_id });
      this.socket.emit('manageFundsHistories', data.data);
      this.setState({
        credit_number: '',
        credit_name: '',
        payment_address: '',
        country: '',
        amount: '',
        password: '',
        transaction_ID: '',
        disabled: true,
      });
    }).catch( error =>{
      let data = error.response.data;
      console.log(data.errors);
    })
  };

  fetchPayments = () => {
    axios.get('/api/payments')
    .then( response => {
      let data = response.data.data;
      if(data.length){
        let payment_index = this.state.payment_index !== '' ? this.state.payment_index : 0;
        this.setState({ payment_methods: data, payment_index: payment_index, payment_info: data[payment_index] });  
      }
    })
  }

  componentWillMount(){
    this.fetchPayments();
  }

  render() {
    const { type, payment_index, credit_number, credit_name, payment_address, country, amount, password, disabled, payment_methods, payment_info, transaction_ID } = this.state;
    const payments = [];
    if(payment_methods && payment_methods.length){
      for (let i in payment_methods) {
        payments.push(
          <option key={ 'payments_' + i } value={ '' + i + '' }>{ payment_methods[i].title }</option>
        );
      }
    }
    return (
      <div className="transfer-funds event-section-content" onSubmit={this.handleSubmit}>
        <div className="input-group">
          <label htmlFor="type">Type</label>
          <select 
            name="type"
            value={type}
            onChange={this.handleChange}
          >
            <option value="Deposit">Deposit</option>
            <option value="Withdraw">Withdraw</option>
          </select>
        </div>
        <div className="input-group d-block">
          <label htmlFor="payment_index">Payment methods</label>
          <select 
            name="payment_index"
            value={ '' + payment_index + '' }
            onChange={this.handleChange}
          >
            { payments }
          </select>
          <div className="ml-auto">
            <table className="">
              <thead>
                <tr>
                  <td>Account address</td>
                  <td>Account name</td>
                  <td>Country</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{ payment_info.account_address }</td>
                  <td>{ payment_info.account_name }</td>
                  <td>{ payment_info.country }</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="credit_number">Transaction ID</label>
          <input
            type="text"
            name="transaction_ID"
            value={transaction_ID}
            onChange={this.handleChange}
            placeholder="Required"
          />
        </div>
        <div className="input-group">
          <label htmlFor="credit_number">Credit card number</label>
          <input
            type="text"
            name="credit_number"
            value={credit_number}
            onChange={this.handleChange}
            placeholder="Required"
          />
        </div>
        <div className="input-group">
          <label htmlFor="credit_name">Credit name</label>
          <input
            type="text"
            name="credit_name"
            value={credit_name}
            onChange={this.handleChange}
            placeholder="Required"
          />
        </div>
        <div className="input-group">
          <label htmlFor="payment_address">Payment address</label>
          <input
            type="text"
            name="payment_address"
            value={payment_address}
            onChange={this.handleChange}
            placeholder="Enter a payment address"
          />
        </div>
        <div className="input-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            name="country"
            value={country}
            onChange={this.handleChange}
            placeholder="Enter a country"
          />
        </div>
        <div className="input-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            name="amount"
            onChange={this.handleChange}
            value={amount}
            placeholder="Required"
            min="0"
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
      </div>
    );
  }
}

export default ManageFunds;
