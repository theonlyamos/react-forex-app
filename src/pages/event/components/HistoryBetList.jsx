import React from 'react';
import { formatMoney } from '../../../common/utils/formatters';

const UserHistoryBetList = ({ bets = [], candidates = [], results = [], mine = false }) => (
  <div
    className={
      'event-section-inner small ' + (mine ? 'user-history-event-bet-section' : 'history-event-bet-section')
    }
  >
    <div className="event-section-header">{mine ? 'Your Bets' : 'Bets list'}</div>
    <div className="event-section-content">
      <div className="event-bet">
        {!mine && <div>User</div>}
        <div>Candidate</div>
        <div>Bet</div>
        <div>Safe</div>
        <div>Risk</div>
        <div>Estimated Profit</div>
        <div>Win</div>
        <div>Lose</div>
        <div>Refund</div>
      </div>
      {bets.map(bet => {
        const candidate = candidates.find(candidate => candidate.id === bet.candidate_id);
        const result = results.find(result => result.bet_id === bet.id);

        return (
          <div className="event-bet" key={bet.id}>
            {!mine && <div>{bet.username}</div>}
            <div>{candidate && candidate.name}</div>
            <div>{formatMoney(bet.bet && bet.bet)}</div>
            <div>{formatMoney(bet.safe && bet.safe)}</div>
            <div>{formatMoney(bet.risk && bet.risk)}</div>
            <div className={bet.earning < 0 ? 'loss' : ''}>{formatMoney(bet.earning)}</div>
            <div>{formatMoney(result && result.win)}</div>
            <div>{formatMoney(result && result.lose)}</div>
            <div>{formatMoney(result && result.refund)}</div>
          </div>
        );
      })}
    </div>
  </div>
);

export default UserHistoryBetList;
