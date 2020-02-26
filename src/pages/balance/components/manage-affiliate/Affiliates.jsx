import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from '../../../../common/components/tabs';
import WithdrawAffiliate from './WithdrawAffiliate';
import AuthService from '../../../../common/services/auth.service';
import { actions as userActions } from '../../../../redux/user/actions';
import axios from 'axios';

class Affiliates extends PureComponent {
  constructor(props){
    super(props);
    this.socket = props.props.socket;

    const {
      user: { referral_token },
    } = this.props;

    this.socket.on('updateAffiliates', function(data){
      if(data && data === referral_token){
        this.fetchReferrals();
      }
    }.bind(this));
  }

  static propTypes = {
    user: PropTypes.shape({
      referral_token: PropTypes.string,
    }),
  };

  initialState = {
    referralList: '',
  };

  state = this.initialState;

  fetchReferrals = () => {
    axios.get('/api/me/referrals')
    .then( response => {
      let data = response.data;
      this.setState({referralList: data});
    })
  }

  componentWillMount(){
    this.fetchReferrals();
  }

  render() {
    const {
      user: { referral_token, account_type },
    } = this.props;
    const { referralList } = this.state;

    let referrals = [];
    for(let i in referralList){
      let data = referralList[i];
      referrals.push(
        <div className="event-bet" key={data.id}>
          <div>{data.username}</div>
          <div className="pull-right">{data.share}</div>
        </div>
      );
    }
    var adminToken = AuthService.adminToken;
    const Affiliates = 
      <div className="affiliate__list">
        <div className="event-section-header">
          <div className="affiliates__header">Affiliates</div>
          <div className="event-section-header-pulled affiliates__ref pull-right">
            <a href={ window.location.origin + '?ref=' + referral_token }>{ '?ref=' + referral_token }</a>
          </div>
        </div>
        <div className="event-section-content">
          <div className="event-bet">
            <div>Username</div>
            <div className="pull-right">Your Share</div>
          </div>
          {
            referrals
          }
        </div>
      </div>;
    return (
      <div className="event-section-inner small affiliates">
        {account_type !== 'ADMIN' && !adminToken &&
          <Tabs headers={['affiliates', 'withdraw to main balance']} panels={[
            Affiliates,
            <WithdrawAffiliate socket={ this.socket }/>
          ]} />
        }
        {(account_type === 'ADMIN' || adminToken) &&
          Affiliates
        }
      </div>
    );
  }
}

export default Affiliates;
