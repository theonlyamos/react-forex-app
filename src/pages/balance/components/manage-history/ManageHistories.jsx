import React, { PureComponent } from 'react';
import { formatMoney } from '../../../../common/utils/formatters';
import axios from 'axios';
import moment from 'moment';

import './ManageHistories.css';

class ManageHistories extends PureComponent {
  constructor(props) {
    super(props);
    this.socket = props.props.socket;
  }

  initialState = {
    transactions: '',
    histories: '',
    user: '',
  };

  state = this.initialState;

  fetchHistories = () => {
    axios.get('/api/me/transaction-history')
    .then( response => {
      let data = response.data.data;
      this.setState({ histories: data.transaction_histories, transactions: data.transactions, user: this.props.props.user });
    })
  }

  processFunds = (transaction, status) =>{
    console.log(transaction);
    axios.post('/api/me/process-transaction', { transaction: transaction, status: status })
    .then( response => {
      let data = response.data;
      alert(data.message);
      this.socket.emit('processBalance', { to_user_id: null, from_user_id: data.data.user_id });
      this.socket.emit('manageFundsHistories', data.data);
    })
  } 
  componentWillMount() {
    this.fetchHistories();
  }
  render() {
    const { histories, transactions, user } = this.state;

    const table_head = user.account_type !== 'ADMIN'
      ? <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      : <tr>
          <th>Date</th>
          <th>Username</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Payment method</th>
          <th>Transaction ID</th>
          <th>Credit number</th>
          <th>Credit name</th>
          <th>Payment address</th>
          <th>Country</th>
          <th>Status</th>
          <th>Action</th>
        </tr>;
    const indents = [];
    if(histories && histories.length){
      for (let i in histories) {
        let transaction = histories[i].transaction;
        let user_transfer = histories[i].user_transfer;
        let payment = histories[i].payment;
        if(user.account_type !== 'ADMIN'){
          indents.push(
            <tr key={ 'transaction' + i }>
              <td>{ moment(transaction['transaction_date']).format('DD/MM/YYYY hh:mm:ss') }</td>
              <td>{ transaction['type'] }</td>
              <td>{ transaction['type'] === 'Withdraw' ? '-' + formatMoney(transaction['amount']) : '+' + formatMoney(transaction['amount']) }</td>
              <td>{ transaction['status'] }</td>
            </tr>
          );  
        }else{
          indents.push(
            <tr key={ 'transaction' + i }>
              <td>{ moment(transaction['transaction_date']).format('DD/MM/YYYY hh:mm:ss') }</td>
              <td>{ user_transfer.name }</td>
              <td>{ transaction['type'] }</td>
              <td>{ formatMoney(transaction['amount']) }</td>
              <td>{ payment ? payment.title : '' }</td>
              <td>{ transaction['transaction_ID'] }</td>
              <td>{ transaction['credit_number'] }</td>
              <td>{ transaction['credit_name'] }</td>
              <td>{ transaction['payment_address'] }</td>
              <td>{ transaction['country'] }</td>
              <td>{ transaction['status'] }</td>
              <td>
                <span className="d-flex">
                  { transaction['status'] === 'Pending' ? <button type="button" className="button col-6 btn-success" onClick={ () => this.processFunds(transaction, 'Success') }>Accept</button> : '' }
                  { transaction['status'] === 'Pending' ? <button type="button" className="button col-6 btn-danger" onClick={ () => this.processFunds(transaction, 'Cancel') }>Reject</button> : '' }
                </span>
              </td>
            </tr>
          );
        }
      }
    }
    return (
      <div className="manange__table">
        <div className="form-group">
          <label className="col-6">Total deposit: { formatMoney(transactions.total_deposit) }</label>
          <label className="col-6">Total withdraw: { formatMoney(transactions.total_withdraw) }</label>
          <label className="col-6">Total affiliate: { formatMoney(transactions.total_affiliate) }</label>
        </div>
        <table>
          <thead>
            { table_head }
          </thead>
          <tbody>
            { indents }
          </tbody>
        </table>
      </div>
    );
  }
}

export default ManageHistories;
