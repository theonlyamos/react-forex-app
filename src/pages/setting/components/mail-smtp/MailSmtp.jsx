import React, { PureComponent } from 'react';
import axios from 'axios';

class MailSmtp extends PureComponent {
  constructor(props) {
    super(props);

    this.socket = props.props.socket;
  }

  initialState = {
    mail_host: '',
    mail_port: '',
    mail_username: '',
    mail_password: '',
    disabled: true,
  };

  state = this.initialState;

  handleChange = ({ target: { name, value } }) => {
    const { mail_host, mail_port, mail_username, mail_password } = this.state;
    const disabled = !mail_host || !mail_port || !mail_username || !mail_password;
    this.setState({ [name]: value, disabled });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { mail_host, mail_port, mail_username, mail_password } = this.state;
    
    axios.post('/api/settings/update?type=mail', { mail_host, mail_port, mail_username, mail_password })
    .then( response => {
      let data = response.data;
      alert(data.message);
    }).catch( error =>{
      let data = error.response.data;
      console.log(data.errors);
    })
  };

  fetchMailSetting(){
    axios.get('/api/settings?type=mail')
    .then( response => {
      let data = response.data.data;
      const { mail_host, mail_port, mail_username, mail_password } = data;
      const disabled = !mail_host || !mail_port || !mail_username || !mail_password;
      this.setState({ 
        mail_host,
        mail_port,
        mail_username,
        mail_password, 
        disabled 
      });
    })
  }

  componentWillMount(){
    this.fetchMailSetting();
  }

  render() {
    const { mail_host, mail_port, mail_username, mail_password, disabled } = this.state;
    return (
      <div className="transfer-funds event-section-content" onSubmit={this.handleSubmit}>
        <div className="input-group">
          <label htmlFor="mail_host">Mail host</label>
          <input
            type="text"
            name="mail_host"
            onChange={this.handleChange}
            value={ mail_host }
            placeholder="Required"
          />
        </div>
        <div className="input-group">
          <label htmlFor="mail_port">Mail port</label>
          <input
            type="text"
            name="mail_port"
            onChange={this.handleChange}
            value={ mail_port }
            placeholder="Required"
          />
        </div>
        <div className="input-group">
          <label htmlFor="mail_username">Mail username</label>
          <input
            type="text"
            name="mail_username"
            onChange={this.handleChange}
            value={ mail_username }
            placeholder="Required"
          />
        </div>
        <div className="input-group">
          <label htmlFor="mail_password">Mail password</label>
          <input
            type="text"
            name="mail_password"
            onChange={this.handleChange}
            value={ mail_password }
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

export default MailSmtp;
