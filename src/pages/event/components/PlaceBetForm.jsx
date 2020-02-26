import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '../../../common/utils/formatters';

class PlaceBetForm extends PureComponent {
  static propTypes = {
    candidate: PropTypes.string,
    amount: PropTypes.number,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  handleSubmit = e => {
    e.preventDefault();

    const { onSubmit } = this.props;

    onSubmit && onSubmit(e);
  };

  render() {
    const {
      candidate,
      balance = 0,
      amount = '',
      estimation = '0.00',
      risk = '0.00',
      safe = '0.00',
      onChange = () => null,
    } = this.props;

    const disabled = !amount || !candidate || amount > balance;

    return (
      <form className="place-bet-form" onSubmit={this.handleSubmit}>
        <div className="event-section-inner">
          <div className="event-section-header">Place Bet</div>
          <div className="event-section-content">
            <div className="input-group">
              <label>On</label>
              <span className="placeholder">{candidate || 'Select a Candidate'}</span>
            </div>
            <div className="input-group">
              <label htmlFor="bet_amount">Amount</label>
              <input
                type="number"
                name="amount"
                id="bet_amount"
                placeholder="Required"
                min="0"
                onChange={onChange}
                value={amount || ''}
              />
            </div>
            <div className="input-group">
              <label>Estimated Profit</label>
              <span>{formatMoney(estimation && estimation)}</span>
            </div>
            <div className="input-group">
              <label>Risk</label>
              <span>{formatMoney(risk && risk)}</span>
            </div>
            <div className="input-group">
              <label>Safe</label>
              <span>{formatMoney(safe && safe)}</span>
            </div>
            <div className="input-group">
              <input
                type="submit"
                disabled={disabled}
                value="Place Bet"
                className={'btn btn-actioncall ' + (disabled ? 'disabled' : '')}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default PlaceBetForm;
