import React, { PureComponent } from 'react';
import axios from 'axios';

class AddPayments extends PureComponent {
  constructor(props) {
    super(props);

    this.socket = props.props.socket;
  }

  initialState = {
    payment_method: '',
    account_address: '',
    account_name: '',
    country: '',
    disabled: true,
  };

  state = this.initialState;

  handleChange = ({ target: { name, value } }) => {
    const { payment_method } = this.state;
    const disabled = !payment_method;
    this.setState({ [name]: value, disabled });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { payment_method, account_name, account_address, country } = this.state;
    
    axios.post('/api/payments/create', { payment_method, account_name, account_address, country })
    .then( response => {
      let data = response.data;
      alert(data.message);
      this.socket.emit('addPayments', true);
      this.setState(this.initialState);
    }).catch( error =>{
      let data = error.response.data;
      console.log(data.errors);
    })
  };

  componentWillMount(){
  }

  render() {
    const { payment_method, account_name, account_address, country, disabled } = this.state;
    return (
      <div className="transfer-funds event-section-content" onSubmit={this.handleSubmit}>
        <div className="input-group">
          <label htmlFor="payment_method">Payment method</label>
          <input
            type="text"
            name="payment_method"
            onChange={this.handleChange}
            value={ payment_method }
            placeholder="Required"
          />
        </div>
        <div className="input-group">
          <label htmlFor="account_address">Account address</label>
          <input
            type="text"
            name="account_address"
            onChange={this.handleChange}
            value={ account_address }
            placeholder="Required"
          />
        </div>
        <div className="input-group">
          <label htmlFor="account_name">Account name</label>
          <input
            type="text"
            name="account_name"
            onChange={this.handleChange}
            value={ account_name }
            placeholder="Required"
          />
        </div>
        <div className="input-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            name="country"
            onChange={this.handleChange}
            value={ country }
            placeholder="Enter a country"
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

export default AddPayments;
