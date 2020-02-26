import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { formatMoney } from '../../../common/utils/formatters';

class ModifyBet extends PureComponent {
  static propTypes = {
    candidate: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    originAmount: PropTypes.number.isRequired,
    amount: PropTypes.number,
  };

  handleSubmit = e => {
    e.preventDefault();

    const { onSubmit } = this.props;

    onSubmit && onSubmit(e);
  };

  render() {
    const {
      candidate,
      originAmount,
      amount = '',
      estimated = '0.00',
      onChange = () => null,
      onCancel = () => null,
    } = this.props;
    const btnText =
      (originAmount === amount && 'Modify Bet') ||
      (originAmount !== amount &&
        ((amount <= 0 && 'Remove Bet') ||
          (amount > originAmount && `Raise +${formatMoney(amount - originAmount)}`) ||
          (amount < originAmount && `Lower -${formatMoney(originAmount - amount)}`)));
    const disabled = originAmount === amount ? 'disabled' : '';

    return (
      <form className="modify-bet-form" onSubmit={this.handleSubmit}>
        <div className="event-section-inner">
          <div className="event-section-header">Modify Bet</div>
          <div className="event-section-content">
            <div className="input-group">
              <label>On</label>
              <span>{candidate}</span>
            </div>
            <div className="input-group">
              <label htmlFor="bet_amount">Amount</label>
              <input
                type="number"
                id="bet_amount"
                name="amount"
                placeholder="Required"
                min="0"
                value={amount}
                onChange={onChange}
              />
            </div>
            <div className="input-group">
              <label>Estimated Profit</label>
              <span>{estimated}</span>
            </div>
            <div className="input-group">
              <input
                type="submit"
                value={btnText}
                disabled={disabled}
                className={'btn btn-primary ' + disabled}
              />
            </div>
            <div className="input-group">
              <input
                type="button"
                value="Cancel"
                className="btn btn-cancel active"
                onClick={onCancel}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default ModifyBet;
