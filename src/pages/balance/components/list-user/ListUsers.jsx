import React, { PureComponent } from 'react';
import { formatMoney } from '../../../../common/utils/formatters';
import { decode } from '../../../../common/utils/jwt.util';
import AuthService from '../../../../common/services/auth.service';
import axios from 'axios';

import './ListUsers.css'
class ListUsers extends PureComponent {
  constructor(props) {
    super(props);

    this.socket = props.props.socket;
    const user_type = props.props.user.account_type;
    if(user_type === 'ADMIN'){
      this.socket.on('updateUsers', function(data){
        if(data){
          this.fetchUsers();
        }
      }.bind(this));
    }
  }
  
  initialState = {
    users: '',
  };

  state = this.initialState;

  fetchUsers = () => {
    axios.get('/api/me/list-users')
    .then( response => {
      let data = response.data.data;
      this.setState({ users: data });
    })
  }

  state = this.initialState;

  componentWillMount() {
    this.fetchUsers();
  }

  processUser = (user, status) => {
    axios.post('/api/me/process-user', { user_process: user, status: status })
    .then( response => {
      let data = response.data;
      alert(data.message);
      this.fetchUsers();
      this.socket.emit('processUser', data.data);
    })
  }

  accessUser = (user) => {
    const { setUser } = this.props;
    // const { router } = this.props.props;
    var isSuccess = false;
    var message = '';
    this.socket.emit('accessUser', { user: user, token: AuthService.accessToken });
    this.socket.on('updateAccessUser', function(data){
      if(!data.error){
        AuthService.adminToken = data.data.admin_token;
        AuthService.accessToken = data.data.user_access_token;
        setUser(decode(data.data.user_access_token));
        isSuccess = true;
        message = data.message;
      }else{
        message = data.error;
      }
    }.bind(this));
    setTimeout(function(){ 
      if(isSuccess){
        alert(message + ' You can go back to admin by press top right button.');
      }else{
        alert('Access denied! ' + message);
      }
    }, 500); 
  }

  render() {
    const { users } = this.state;
    const indents = [];
    let total_balance = 0;
    if(users && users.length){
      for (let i in users) {
        total_balance += users[i].balance;
        let user = users[i];
        indents.push(
          <tr key={ 'user' + i }>
            <td>{ user.username }</td>
            <td>{ user.email }</td>
            <td>{ formatMoney(user.balance) }</td>
            <td>{ formatMoney(user.affiliate_balance) }</td>
            <td>{ user.status }</td>
            <td>
              <div className="d-flex">
                { user.status === 'Active' 
                  && <button type="button" className="button btn-danger" onClick={ () => this.processUser(user, 'Banned') }>Ban</button> 
                }
                { user.status === 'Banned'
                  && <button type="button" className="button btn-success" onClick={ () => this.processUser(user, 'Active') }>Unban</button> 
                }
                { user.status === 'Inactive'
                  && <button type="button" className="button btn-success" onClick={ () => this.processUser(user, 'Active') }>Activate</button> 
                }
              </div>
            </td>
            <td>
              { user.status === 'Active'  && 
                <button type="button" className="button btn-info" onClick={ () => this.accessUser(user) }>Access</button>
              }
            </td>
          </tr>
        ); 
      }
    }
    return (
      <div className="user__table">
        <div className="form-group">
          <label className="col-6">Total balance: { formatMoney(total_balance) }</label>
        </div>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>User Email</th>
              <th>Balance</th>
              <th>Affiliate Balance</th>
              <th>Status</th>
              <th>Action</th>
              <th>View User</th>
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

export default ListUsers;
