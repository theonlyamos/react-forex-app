import React, { Component } from 'react';
import { formatMoney } from '../../../../common/utils/formatters';
import axios from 'axios';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { formatDate, parseDate } from 'react-day-picker/moment';

import 'react-day-picker/lib/style.css';
import './TransferHistories.css';

class TransferHistories extends Component {
  constructor(props) {
    super(props);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
  }

  initialState = {
    transfer: '',
    histories: '',
    searchUsername: '',
    from: undefined,
    to: undefined,
  };

  state = this.initialState;

  fetchHistories = () => {
    let queryString = '';
    if(this.state.searchUsername){
      queryString += '&username=' + this.state.searchUsername;
    }
    let from_date = this.state.from ? moment(this.state.from).format('YYYY-MM-DD') : '';
    let to_date = this.state.to ? moment(this.state.to).format('YYYY-MM-DD') : '';
    if(from_date){
      queryString += '&from=' + from_date;
    }
    if(to_date){
      queryString += '&to=' + to_date;
    }
    axios.get('/api/me/transfer-history?type=Transfer' + queryString)
    .then( response => {
      let data = response.data.data;
      this.setState({ histories: data.transfer_history, transfer: data.transfer });
    })
  }

  showFromMonth() {
    const { from, to } = this.state;
    if (!from) {
      return;
    }
    if (moment(to).diff(moment(from), 'months') < 2) {
      this.to.getDayPicker().showMonth(from);
    }
  }
  handleFromChange(from) {
    this.setState({ from });
  }
  handleToChange(to) {
    this.setState({ to }, this.showFromMonth);
  }

  handleUsername(e){
    this.setState({ searchUsername: e.target.value });
  }

  componentWillMount() {
    this.fetchHistories();
  }

  handleSearch = e => {
    e.preventDefault();
    this.fetchHistories();
  }

  render() {
    const { histories, transfer, from, to } = this.state;
    const modifiers = { start: from, end: to };
    const indents = [];
    if(histories && histories.length){
      for (let i in histories) {
        let history = histories[i]['transfer'];
        let user_transfer = histories[i]['user_transfer'];
        indents.push(
          <tr key={ 'history_' + i }>
            <td>{ moment(history['transfer_date']).format('DD/MM/YYYY hh:mm:ss') }</td>
            <td>{ user_transfer ? user_transfer.name : '' }</td>
            <td>{ history['action'] }</td>
            <td>{ user_transfer && user_transfer['status'] === 'send' ? '-' + formatMoney(history['amount']) : '+' + formatMoney(history['amount']) }</td>
          </tr>
        );
      }
    }
    return (
      <div className="histories__table">
        <div className="form-group col-12">
          <form>
            <div className="InputFromTo">
              <DayPickerInput
                value={from}
                placeholder="From date"
                format="DD/MM/YYYY"
                formatDate={formatDate}
                parseDate={parseDate}
                dayPickerProps={{
                  selectedDays: [from, { from, to }],
                  disabledDays: { after: to },
                  toMonth: to,
                  modifiers,
                  numberOfMonths: 2,
                  onDayClick: () => this.to.getInput().focus(),
                }}
                onDayChange={this.handleFromChange}
              />
              <span className="InputFromTo-to">
                <DayPickerInput
                  ref={el => (this.to = el)}
                  value={to}
                  placeholder="To date"
                  format="DD/MM/YYYY"
                  formatDate={formatDate}
                  parseDate={parseDate}
                  dayPickerProps={{
                    selectedDays: [from, { from, to }],
                    disabledDays: { before: from },
                    modifiers,
                    month: from,
                    fromMonth: from,
                    numberOfMonths: 2,
                  }}
                  onDayChange={this.handleToChange}
                />
              </span>
            </div>
            <div className=""
            >
              <input 
                type="text" 
                className="form-control col-12" 
                placeholder="Enter a Username" 
                onChange={ this.handleUsername } 
                value={ this.state.searchUsername }
              />
            </div>            
            <button className="button col-6 btn-success" type="submit" onClick={ this.handleSearch }>Search</button>
          </form>
        </div>
        <div className="form-group">
          <label className="col-6">Total sent: { formatMoney(transfer.total_sent) }</label>
          <label className="col-6">Total received: { formatMoney(transfer.total_received) }</label>
        </div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Username</th>
              <th>Action</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            { indents }
          </tbody>
        </table>
      </div>
    );
  }
}

export default TransferHistories;
