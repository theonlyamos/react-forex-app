import React, { PureComponent } from 'react';
import axios from 'axios';

import './ForgotPass.css';

class ForgotPass extends PureComponent {
  initialState = {
    email: '',
    token: this.props.routeParams ? this.props.routeParams.token : '',
    message: '',
    password: '',
    c_password: '',
  };

  state = this.initialState;

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  state = this.initialState;
  handleSubmit = e => {
    // Init 
    const { router } = this.props;
    const { email, token, password, c_password } = this.state;
    let data = {};
    if(!token || password){
      e.preventDefault();
    }
    data.token = token;
    if(!token){
      data.email = email;
      data.url = window.location.origin;
    }
    if(password){
      data.password = password;
      data.c_password = c_password;
    }
    axios.post('/api/auth/forgot-pass', data)
    .then( response => {
      let data = response.data;
      if(!token || password){
        alert(data.message); 
      }
      if(password){
        router.push('/login');
      }
      this.setState(this.initialState);     
    }).catch( error =>{
      let data = error.response.data;
      if(error.response.status !== 400){
        this.setState({'message' : data.message});  
      }
    })
  }

  componentWillMount(){
    const { token } = this.state;
    if(token){
      this.handleSubmit();
    }
  }
  render() {
    const { email, token, message, password, c_password } = this.state;
    return (
       <section className="login">
        <div className="small-container">
          <form onSubmit={ this.handleSubmit }>
            {!token && 
              <div>
                <h2>Enter your info to reset new password</h2>
                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="mail"
                    id="email"
                    name="email"
                    required
                    placeholder="Required"
                    value={email}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            }
            {!message && token && 
              <div>
                <h2>Enter new password</h2>
                <div className="input-group">
                  <label htmlFor="email">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    placeholder="Required"
                    value={password}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="email">Re-Type Password</label>
                  <input
                    type="password"
                    id="c_password"
                    name="c_password"
                    required
                    placeholder="Required"
                    value={c_password}
                    onChange={this.handleChange}
                  />
                </div>
              </div> 
            }
            {message &&
              <div>
                <h2>{ message }</h2>
              </div>
            }
            {!message &&
              <div className="input-group">
                <input
                  type="submit"
                  id="login-form"
                  name="login-form"
                  value="Submit"
                  className="btn btn-primary"
                />
              </div>
            }
          </form>
        </div>
      </section>
    );
  }
}

export default ForgotPass;
