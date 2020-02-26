import React, { Component } from 'react';
import AuthService from '../../common/services/auth.service';
import { decode } from '../../common/utils/jwt.util';
import { Link } from 'react-router';

import './Login.css';

class Login extends Component {
  state = {
    email: '',
    password: '',
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = async e => {
    const { setUser, router } = this.props;
    const { email, password } = this.state;
    e.preventDefault();

    try {
      const {
        data: { token },
      } = await AuthService.login(email, password);
      AuthService.accessToken = token;
      setUser(decode(token));
      router.push('/dashboard');
    } catch (e) {
      const error = e.response;
      if (typeof error === 'object'){
        if (error.status === 400){
          for (var i in error.data.errors){
            alert(error.data.errors[i])
          }
        }
      }
      else {
        console.log(e)
      }
      /*
       * if(error.status === 403){
        alert(error.data.message);
      }
      */
     // console.log(error);
    }
  };

  render() {
    const { email, password } = this.state;

    return (
      <section className="login">
        <div className="small-container">
          <form onSubmit={this.handleSubmit}>
            <h2>Enter your credentials to Sign In</h2>
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
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                name="password"
                placeholder="Required"
                onChange={this.handleChange}
              />
            </div>
            <div className="mt-1 text-right">
              <Link to="/forgot-pass" className="">
                Forgot password?
              </Link>
            </div>
            <div className="input-group">
              <input
                type="submit"
                id="login-form"
                name="login-form"
                value="Login"
                className="btn btn-primary"
              />
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default Login;
