import React from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '../../../common/utils/formatters';

const BetList = ({ bets = [] }) => (
  <div className="event-section-inner small bet-list">
    <div className="event-section-header header-sm">Bets list</div>
    <div className="event-section-content">
      <div className="event-bet">
        <div>User</div>
        <div>Candidate</div>
        <div>Bet</div>
        <div>Safe</div>
        <div>Risk</div>
        <div>Estimated Profit</div>
      </div>
      {bets.map(({ bet, safe, risk, earning, id, username, candidate }) => (
        <div className="event-bet" key={id}>
          <div>{username}</div>
          <div>{candidate}</div>
          <div>{formatMoney(bet && bet)}</div>
          <div>{formatMoney(safe && safe)}</div>
          <div>{formatMoney(risk && risk)}</div>
          <div>{formatMoney(earning)}</div>
        </div>
      ))}
    </div>
  </div>
);

BetList.propTypes = {
  onEdit: PropTypes.func,
  bets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      bet: PropTypes.number.isRequired,
      safe: PropTypes.number.isRequired,
      risk: PropTypes.number.isRequired,
      earning: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
      candidate: PropTypes.string.isRequired,
    }),
  ),
};

export default BetList;
