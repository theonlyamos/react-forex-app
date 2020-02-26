import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CandidateList from '../CandidateList';
import PlaceBetForm from '../PlaceBetForm';
import UserBetList from '../UserBetList';
import BetList from '../BetList';
import ModifyBet from '../ModifyBet';
import Chart from '../Chart';
import SocketService from '../../../../common/services/socket.service';
import AuthService from '../../../../common/services/auth.service';

import './Content.css';
import { isMobile } from '../../../../common/utils/mobile-check.util';

class Content extends Component {
  static propTypes = {
    event: PropTypes.shape({
      candidates: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        }),
      ),
      id: PropTypes.number.isRequired,
      bets: PropTypes.arrayOf(
        PropTypes.shape({
          candidate_id: PropTypes.number.isRequired,
          mine: PropTypes.bool,
        }),
      ),
    }),
    updateRuntimeCalculationEvent: PropTypes.func.isRequired,
    balance: PropTypes.number.isRequired,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { estimation, risk, safe } = nextProps;

    return { estimation, risk, safe };
  }

  initialState = {
    candidate: null,
    amount: 0,
    estimation: null,
    risk: null,
    safe: null,
  };

  state = { ...this.initialState };

  shouldComponentUpdate(nextProps, prevState) {
    if (nextProps.event.id !== this.props.event.id) {
      this.setState(this.initialState);
    }

    return true;
  }

  handleChangeCandidate = candidateId => {
    this.setState({ candidate: candidateId }, () => {
      this.runtimeCalculationEvent();
    });
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value }, () => {
      this.runtimeCalculationEvent();
    });
  };

  runtimeCalculationEvent = () => {
    const { candidate } = this.state;
    const {
      event: { id, type },
    } = this.props;
    const amount = this.state.amount;

    candidate && SocketService.send('runtime_calculate_event', { amount, id, candidate, type });
  };

  handleSubmitBet = e => {
    const { candidate } = this.state;
    const {
      updateRuntimeCalculationEvent,
      event: { id, type },
    } = this.props;
    const amount = this.state.amount;
    SocketService.send('bet', { amount, id, candidate, type });
    updateRuntimeCalculationEvent();
    this.setState({ ...this.initialState });
  };

  handleSubmitModifyBet = modifyBet => {
    const amount = this.state.amount;
    const {
      event: { id: event, type },
    } = this.props;
    const { id, candidate_id: candidate } = modifyBet;

    SocketService.send('modify_bet', { amount, id, candidate, event, type });
    this.handleCancelModifyBetForm();
  };

  handleModifyBetForm = modifyBet => {
    const isModifyBet = true;
    const { id: modifyBetId, bet } = modifyBet;
    const amount = bet;

    this.setState({ modifyBetId, isModifyBet, amount });
  };

  handleCancelModifyBetForm = () => {
    const isModifyBet = false;
    const modifyBetId = null;

    this.setState({ ...this.initialState, isModifyBet, modifyBetId });
  };

  get candidates() {
    const {
      event: {
        candidates = [],
        bets = [],
        status: { ended },
      },
    } = this.props;

    return candidates.map(candidate => {
      candidate.disabled = bets.some(bet => candidate.id === bet.candidate_id && bet.mine) || ended;
      return candidate;
    });
  }

  get userBets() {
    const {
      event: {
        bets = [],
        candidates = [],
        status: { ended },
      },
    } = this.props;

    return bets.filter(bet => bet.mine && !ended).map(bet => {
      const { name: candidate } = candidates.find(candidate => candidate.id === bet.candidate_id);

      return { ...bet, candidate };
    });
  }

  get betList() {
    const {
      event: {
        bets = [],
        candidates = [],
        status: { ended },
      },
    } = this.props;

    return bets.filter(bet => !bet.mine || ended).map(bet => {
      const { name: candidate } = candidates.find(candidate => candidate.id === bet.candidate_id);

      return { ...bet, candidate };
    });
  }

  get betForModify() {
    const { modifyBetId } = this.state;
    const {
      event: { bets = [], candidates = [] },
    } = this.props;

    const bet = bets.find(bet => bet.id === modifyBetId);
    const { name: candidate } = candidates.find(({ id }) => id === bet.candidate_id);

    return { ...bet, candidate };
  }

  render() {
    const { candidate, amount, isModifyBet = false, estimation, risk, safe } = this.state;
    let adminToken = AuthService.adminToken;
    const {
      event: { candidates = [], type },
      bets,
      balance,
    } = this.props;
    const candidateName = candidates.find(({ id }) => id === candidate);
    const isForexEvent = type === 'FOREX_EVENT';

    let modifyBet;

    return (
      <div className="event-page">
        {isForexEvent && <Chart chart={this.props.chart} event={this.props.event} />}
        <div className="event-wrapper-content">
          <div className="event-sections">
            <div className="event-wrapper-content__section event-section">
              <CandidateList
                bets={bets}
                candidates={this.candidates}
                candidate={candidate}
                onChange={this.handleChangeCandidate}
              />
            </div>
            {!isMobile && (
              <div className="event-section">
                <BetList bets={this.betList} />
              </div>
            )}
            {isMobile && (
              <div className="event-section">
                {!isModifyBet && (
                  <PlaceBetForm
                    amount={Number(amount)}
                    candidate={candidateName && candidateName.name}
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmitBet}
                    estimation={estimation}
                    risk={risk}
                    safe={safe}
                    balance={balance}
                  />
                )}
                {isModifyBet &&
                  (modifyBet = this.betForModify) && (
                    <ModifyBet
                      amount={Number(amount)}
                      originAmount={modifyBet.bet}
                      candidate={modifyBet.candidate}
                      onChange={this.handleChange}
                      onSubmit={() => this.handleSubmitModifyBet(modifyBet)}
                      onCancel={this.handleCancelModifyBetForm}
                    />
                  )}
              </div>
            )}
          </div>
          <div className="event-sections">
            {!isMobile && (
              <div className="event-section">
                {!isModifyBet && (
                  <PlaceBetForm
                    amount={Number(amount)}
                    candidate={candidateName && candidateName.name}
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmitBet}
                    estimation={estimation}
                    risk={risk}
                    safe={safe}
                    balance={balance}
                  />
                )}
                {isModifyBet &&
                  (modifyBet = this.betForModify) && (
                    <ModifyBet
                      amount={Number(amount)}
                      originAmount={modifyBet.bet}
                      candidate={modifyBet.candidate}
                      onChange={this.handleChange}
                      onSubmit={() => this.handleSubmitModifyBet(modifyBet)}
                      onCancel={this.handleCancelModifyBetForm}
                    />
                  )}
              </div>
            )}
            <div className="event-section">
              {(adminToken || !adminToken) &&
                <UserBetList bets={this.userBets} onEdit={this.handleModifyBetForm} />
              }
            </div>
            {isMobile && (
              <div className="event-section">
                {(adminToken || !adminToken) &&
                 <BetList bets={this.betList} />
                }
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Content;
