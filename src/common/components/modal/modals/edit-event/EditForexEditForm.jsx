import React, { Component } from 'react';
import SocketService from '../../../../../common/services/socket.service';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Creatable from 'react-select/lib/Creatable';
import Select from 'react-select';
import { isMobile } from '../../../../utils/mobile-check.util';

import 'react-datepicker/dist/react-datepicker.css';

class EditForexEventForm extends Component {
  constructor(props) {
    super(props);

    const {
      commission,
      status: { start_date, end_date, period, update },
      infos: { name },
      tick,
      currencies,
      refund,
    } = props.event;
    const candidates = props.event.candidates.map(item => item.name);

    this.state = {
      commission,
      period,
      name,
      startTime: moment(start_date),
      endTime: moment(end_date),
      updateDate: moment(update),
      candidates,
      tick,
      currency: { label: currencies, value: currencies },
      refund: { value: refund, label: `${refund[0].toUpperCase()}${refund.substr(1)}` },
    };
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  handleDateChange = field => date => {
    this.setState({ [field]: date });
  };

  handleChangeRaw = field => ({ target: { value } }) => {
    const date = new Date(value);
    date !== 'Invalid Date' && this.setState({ [field]: moment(date) });
  };

  handleCandidateChange = ({ target: { name, value } }) => {
    let candidates = [...this.state.candidates];
    candidates[name] = value;

    this.setState({ candidates });
  };

  handleSubmit = e => {
    const { onSubmit } = this.props;
    const {
      name,
      startTime,
      endTime,
      period: bcd,
      commission,
      tick,
      currency,
      updateDate,
      refund,
    } = this.state;
    const candidates = this.state.candidates.filter(candidate => Boolean(candidate));
    const start = startTime.valueOf();
    const end = endTime.valueOf();
    const update = updateDate.valueOf();
    const date = { start, end, bcd, update };
    const { id, type } = this.props.event;

    e.preventDefault();
    SocketService.send('update_event', {
      name,
      candidates,
      date,
      commission,
      tick,
      currencies: currency.value.toUpperCase(),
      refund: refund.value,
      id,
      type,
    });
    onSubmit && onSubmit();
  };

  get disabled() {
    const { name, period, commission, tick, currency } = this.state;

    return !name || !period || !commission || !tick || !currency;
  }

  render() {
    const {
      name,
      startTime,
      endTime,
      period,
      candidates,
      commission,
      tick,
      currency,
      updateDate,
      refund,
    } = this.state;
    const symbols = this.props.symbols.map(value => ({ value, label: value }));

    return (
      <form className="add-event-form" onSubmit={this.handleSubmit}>
        <div className="event-section-inner">
          <div className="event-section-header">Edit an Forex Event</div>
          <div className="add-event-form__content event-section-content">
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                placeholder="Required"
                onChange={this.handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="start-time">Start Date</label>
              <DatePicker
                selected={startTime}
                onChange={this.handleDateChange('startTime')}
                onChangeRaw={this.handleChangeRaw('startTime')}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={10}
                dateFormat="LLL"
                id="start-time"
                showYearDropdown
                minDate={moment()}
                timeCaption="time"
                className="react-datepicker-ignore-onclickoutside"
              />
            </div>
            <div className="input-group">
              <label htmlFor="end-time">End Date</label>
              <DatePicker
                selected={endTime}
                onChange={this.handleDateChange('endTime')}
                onChangeRaw={this.handleChangeRaw('endTime')}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={10}
                dateFormat="LLL"
                id="end-time"
                showYearDropdown
                minDate={moment()}
                timeCaption="time"
                className="react-datepicker-ignore-onclickoutside"
              />
            </div>
            <div className="input-group">
              <label htmlFor="update-date">Update Date</label>
              <DatePicker
                selected={updateDate}
                onChange={this.handleDateChange('updateDate')}
                onChangeRaw={this.handleChangeRaw('updateDate')}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={10}
                dateFormat="LLL"
                id="update-date"
                showYearDropdown
                minDate={moment()}
                timeCaption="time"
                className="react-datepicker-ignore-onclickoutside"
              />
            </div>
            <div className="input-group">
              <label htmlFor="tick">Refresh</label>
              <input
                type="number"
                id="tick"
                name="tick"
                value={tick}
                placeholder="Required"
                onChange={this.handleChange}
              />
            </div>
            <div className="input-group">
              <label>Refund</label>
              <Select
                value={refund}
                name="refund"
                options={[{ value: 'admin', label: 'Admin' }, { value: 'clients', label: 'Clients' }]}
                onChange={e => this.handleChange({ target: { name: 'refund', value: e } })}
              />
            </div>
            <div className="input-group">
              <label>Currency</label>
              <Creatable
                name="currency"
                value={currency}
                onChange={e => this.handleChange({ target: { name: 'currency', value: e } })}
                options={symbols}
              />
            </div>
            <div className="input-group">
              <label htmlFor="commission">Commission</label>
              <input
                type="number"
                id="commission"
                name="commission"
                value={commission}
                placeholder="Required"
                onChange={this.handleChange}
                step="0.01"
                min="0"
              />
            </div>
            <div className="input-group">
              <label htmlFor="period">Bet {isMobile ? 'Cancel' : 'Cancelation'} Delay</label>
              <input
                type="number"
                id="period"
                name="period"
                placeholder="Required"
                min="0"
                value={period}
                onChange={this.handleChange}
              />
            </div>
            <div id="candidates">
              {candidates.map((candidate, index) => (
                <div className="input-group" key={index}>
                  <label htmlFor={index + 1}>Candidate #{index + 1}</label>
                  <input
                    type="text"
                    id={index + 1}
                    name={index}
                    disabled
                    placeholder="Required"
                    value={candidate}
                    onChange={this.handleCandidateChange}
                  />
                </div>
              ))}
            </div>
            <div className="input-group">
              <input
                type="submit"
                id="btn-add-event"
                name="btn-add-event"
                disabled={this.disabled}
                className={'btn btn-primary' + (this.disabled ? ' disabled' : '')}
                value="Update Forex Event"
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default EditForexEventForm;
