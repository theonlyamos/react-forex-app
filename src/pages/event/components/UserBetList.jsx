import React from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '../../../common/utils/formatters';

const UserBetList = ({ bets = [], onEdit = () => null }) => (
  <div className="event-section-inner event-bet-section small user-bet-list">
    <span className="event-section-header header-sm">Your Bets</span>
    <div className="event-section-content">
      <div className="event-bet">
        <div>Candidate</div>
        <div>Bet</div>
        <div>Safe</div>
        <div>Risk</div>
        <div>Estimated Profit</div>
        <div className="fixed20" />
      </div>
      {bets.map(bet => (
        <div className="event-bet" key={bet.id}>
          <div>{bet.candidate}</div>
          <div>{formatMoney(bet.bet && bet.bet)}</div>
          <div>{formatMoney(bet.safe && bet.safe)}</div>
          <div>{formatMoney(bet.risk && bet.risk)}</div>
          <div className={bet.earning < 0 ? 'loss' : ''}>{formatMoney(bet.earning)}</div>
          <div className="edit-bet fixed20" onClick={() => onEdit(bet)}>
            <i className="fa fa-cog" aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

UserBetList.propTypes = {
  onEdit: PropTypes.func,
  bets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      bet: PropTypes.number.isRequired,
      safe: PropTypes.number.isRequired,
      risk: PropTypes.number.isRequired,
      earning: PropTypes.number.isRequired,
      candidate: PropTypes.string.isRequired,
    }),
  ),
};

export default UserBetList;
