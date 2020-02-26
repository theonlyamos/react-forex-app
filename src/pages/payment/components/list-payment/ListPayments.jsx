import React, { Component } from 'react';
import axios from 'axios';

import './ListPayments.css'

class ListPayments extends Component {
  constructor(props) {
    super(props);
  }

  initialState = {
    payments: '',
  };

  state = this.initialState;

  fetchPayments = () => {
    axios.get('/api/payments')
    .then( response => {
      let data = response.data.data;
      this.setState({ payments: data });
    })
  }

  componentWillMount(){
    this.fetchPayments();
  }

  render() {
    const { payments } = this.state;
    const indents = [];
    if(payments && payments.length){
      for(let i in payments){
        let payment = payments[i];
        indents.push(
          <tr key={ 'payment_' + i }>
            <td>{ payment.title }</td>
            <td>{ payment.status }</td>
            <td>
              <button type="button" className="button btn-success" onClick="">Edit</button>
            </td>
          </tr>
        );
      }
    }
    return(
      <table className="payments__table">
        <thead>
          <tr>
            <th>Payment method</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          { indents }
        </tbody>
      </table>
    )
  }
}

export default ListPayments;
