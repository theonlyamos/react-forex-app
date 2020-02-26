import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import AuthService from '../../common/services/auth.service';
import { decode } from '../../common/utils/jwt.util';
import axios from 'axios';
import Loader from 'react-loader-spinner'

import './ConfirmRegister.css';

class ConfirmRegister extends PureComponent {
  initialState = {
    message: '',
    success: true,
  };

  state = this.initialState;
  confirmRegister = () => {
    // Init 
    const { setUser, router, socket } = this.props;

    axios.post('/api/auth/confirm-register', { 'mail_token' : this.props.routeParams.token })
    .then( response => {
      let data = response.data;
      this.setState({'message' : data.message});

      // Call socket
      socket.emit('updateListUsers', true);

      // Set auto-login after confirm
      setTimeout(function(){
        const token = data.token;
        AuthService.accessToken = token;
        setUser(decode(token));
        router.push('/dashboard');
      }, 2000);
    }).catch( error =>{
      let data = error.response.data;
      this.setState({'message' : data.message, 'success' : false});
    })
  }

  componentWillMount(){
    this.confirmRegister();
  }
  render() {
    const { message, success } = this.state;
    return (
       <section className="login">
        <div className="small-container">
          <form>
            <h2 className="lh-20">{ message }</h2>
            { success &&
              <div className="text-center">
                <Loader type="ThreeDots" color="blue" height={50} width={50}/> 
              </div>
            }
            { !success &&
              <div className="input-group">
                <Link to="/login" className="btn btn-login btn-primary">
                  Login
                </Link>
              </div>
            }
          </form>
        </div>
      </section>
    );
  }
}

export default ConfirmRegister;
