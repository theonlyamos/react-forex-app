import React, { Component } from 'react';
import AuthService from '../../common/services/auth.service';

class Register extends Component {
  initialState = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  state = this.initialState;
  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = async e => {
    const { email, username, password, confirmPassword } = this.state;
    const { socket } = this.props;
    const referrer_uid = localStorage.getItem('affiliates');
    e.preventDefault();

    try {
      await AuthService.register({
        email,
        username,
        password,
        'password-c': confirmPassword,
        'url': window.origin,
        referrer_uid,
      });

      // Call socket
      socket.emit('updateListUsers', true);
      socket.emit('updateListAffiliates', referrer_uid);

      alert('Register success! Please check mail to confirm the registration.')
      this.setState(this.initialState);
    } catch (e) {
      console.log(e.response);
    }
  };

  render() {
    const { username, email, password, confirmPassword } = this.state;

    return (
      <section className="login">
        <div className="small-container">
          <form onSubmit={this.handleSubmit}>
            <h2>Create Your Account</h2>
            <div className="input-group">
              <label html-for="username">Username</label>
              <input
                type="text"
                id="username"
                required
                name="username"
                value={username}
                placeholder="Required"
                onChange={this.handleChange}
              />
            </div>
            <div className="input-group">
              <label html-for="email">Email Address</label>
              <input
                type="mail"
                id="email"
                name="email"
                required
                value={email}
                placeholder="Required"
                onChange={this.handleChange}
              />
            </div>
            <div className="input-group">
              <label html-for="password">Password</label>
              <input
                type="password"
                id="password"
                required
                value={password}
                name="password"
                placeholder="Required"
                onChange={this.handleChange}
              />
            </div>
            <div className="input-group">
              <label html-for="password-c">Re-Type Password</label>
              <input
                type="password"
                id="password-c"
                name="confirmPassword"
                required
                placeholder="Required"
                value={confirmPassword}
                onChange={this.handleChange}
              />
            </div>
            <div className="input-group">
              <input
                type="submit"
                id="register-form"
                name="register-form"
                value="Create Account"
                className="btn btn-actioncall"
              />
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default Register;
