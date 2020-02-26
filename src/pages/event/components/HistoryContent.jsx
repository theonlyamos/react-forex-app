import React, { PureComponent } from 'react';
import CandidateList from './CandidateList';
import HistoryBetList from './HistoryBetList';
import { formatMoney } from '../../../common/utils/formatters';
import Chart from './Chart';
import AuthService from '../../../common/services/auth.service';

import './HistoryContent.css';

class HistoryContent extends PureComponent {
  get candidates() {
    const {
      event: { candidates = [] },
    } = this.props;

    return candidates.map(candidate => ({ ...candidate, disabled: true }));
  }

  get userBets() {
    const {
      event: { bets = [] },
    } = this.props;

    return bets.filter(bet => bet.mine);
  }

  get betList() {
    const {
      event: { bets = [] },
    } = this.props;

    return bets.filter(bet => !bet.mine);
  }

  render() {
    const { event, user } = this.props;
    const isAdmin = user.account_type === 'ADMIN';
    const adminBet = event.bets.find(bet => bet.user_id === user.id);
    const adminResult = adminBet ? event.results.find(result => result.bet_id === adminBet.id) : null;
    const isForexEvent = event.type === 'FOREX_EVENT';
    let adminToken = AuthService.adminToken;

    return (
      <div className="history-content">
        {isForexEvent && <Chart chart={this.props.chart} event={event} />}
        <div className="event-wrapper-content">
          <div className="event-sections">
            <div className="event-wrapper-content__section event-section">
              <CandidateList candidates={this.candidates} />
            </div>
            <div className="event-section">
              {adminToken &&
                <HistoryBetList bets={this.betList} candidates={event.candidates} results={event.results} />
              }
              {!adminToken &&
                <HistoryBetList bets={this.betList} candidates={event.candidates} results={event.results} />
              }
            </div>
          </div>
          <div className="event-sections">
            <div className="event-section">
              {(adminToken || !adminToken) &&
                <HistoryBetList
                  bets={this.userBets}
                  candidates={event.candidates}
                  results={event.results}
                  mine
                />
              }
            </div>
            {isAdmin && adminResult && <h3>Total Refund: {formatMoney(adminResult.total_refund)}</h3>}
          </div>
        </div>
      </div>
    );
  }
}

export default HistoryContent;
