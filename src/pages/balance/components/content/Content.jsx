import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Affiliates } from '../manage-affiliate';
import { Tabs } from '../../../../common/components/tabs';
import { TransferFunds } from '../transfer-fund';
import { TransferHistories } from '../transfer-history';
import { ManageFunds } from '../manage-fund';
import { ManageHistories } from '../manage-history';
import { ListUsers } from '../list-user';
import AuthService from '../../../../common/services/auth.service';

import './Content.css';

class Content extends PureComponent {
  constructor(props) {
    super(props);

    const user_id = props.user.id;
    const user_type = props.user.account_type;
    this.socket = props.socket
    this.socket.on('updateTransferHistories', function(data){
      if((user_id === data.to_user_id || user_id === data.from_user_id) && this.state.tranfer_histories){
        this.state.tranfer_histories.fetchHistories();
      }
    }.bind(this));
    this.socket.on('updateFundsHistories', function(data){
      if((user_id === data.user_id || user_type === 'ADMIN') && this.state.manage_histories){
        this.state.manage_histories.fetchHistories();
      }
    }.bind(this));
  }

  static propTypes = {
    user: PropTypes.object,
  };
  initialState = {
    tranfer_histories: '',
    manage_histories: '',
    list_users: ''
  };

  state = this.initialState;
  componentDidMount() {
    const { user } = this.props;
    
    if(user.account_type === 'ADMIN'){
      this.setState({ list_users: this.refs.list_users, tranfer_histories: this.refs.tranfer_histories, manage_histories: this.refs.manage_histories });
    }else{
      this.setState({ tranfer_histories: this.refs.tranfer_histories, manage_histories: this.refs.manage_histories });
    }
  }

  render() {
    const { user } = this.props;
    var adminToken = AuthService.adminToken;
    if(!adminToken){
      var manage_tabs = user.account_type !== 'ADMIN'
      ? <Tabs headers={['manage funds', 'history']} panels={[
            <ManageFunds props={this.props}/>, 
            <ManageHistories ref="manage_histories" props={this.props}/>
          ]} />
      : <Tabs headers={['list users', 'deposit and withdraw']} panels={[
          <ListUsers ref="list_users" props={this.props} />,
          <ManageHistories ref="manage_histories" props={this.props}/>,
        ]} />;
      var transfer_tabs = 
        <Tabs headers={['transfer funds', 'history']} panels={[
          <TransferFunds props={this.props}/>,
          <TransferHistories ref="tranfer_histories" props={this.props}/>
        ]} />
    }else{
      manage_tabs = user.account_type !== 'ADMIN'
      ? <Tabs headers={['history']} panels={[
            <ManageHistories ref="manage_histories" props={this.props}/>
          ]} />
      : <Tabs headers={['list users', 'deposit and withdraw']} panels={[
          <ListUsers ref="list_users" props={this.props} />,
          <ManageHistories ref="manage_histories" props={this.props}/>,
        ]} />;
      transfer_tabs = 
        <Tabs headers={['history']} panels={[
          <TransferHistories ref="tranfer_histories" props={this.props}/>
        ]} />
    }

    return (
      <Fragment>
        <div className="balance event-sections">
          <div className="event-section">
            { manage_tabs }
          </div>
          <div className="event-section">
            <Affiliates user={user} props={this.props}/>
          </div>
        </div>
        <div className="balance event-sections">
          <div className="event-section">
            { transfer_tabs }
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Content;
