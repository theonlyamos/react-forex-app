import React, { Component } from 'react';
import SocketService from '../../../../common/services/socket.service';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Creatable from 'react-select/lib/Creatable';
import Select from 'react-select';
import AddSubForexEventForm from './AddSubForexEventForm';

import 'react-datepicker/dist/react-datepicker.css';
import '../add-event-form/AddEventForm.css';

class AddForexEventForm extends Component {
  initialState = {
    name: '',
    startTime: moment(),
    endTime: moment().add(1, 'days'),
    updateDate: moment().add(1, 'days'),
    period: 0,
    commission: 0,
    tick: 0,
    currency: '',
    mainName: '',
    candidates: ['up', 'down', 'equal'],
    refund: '',
    subEvents: [],
  };

  state = this.initialState;

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
    e.preventDefault();

    const { mainName } = this.state;
    const { name, candidates, date, commission, tick, currencies, refund } = this.getResultData(this.state);
    const subEvents = this.state.subEvents.map(event => this.getResultData(event));

    SocketService.send('add_forex_event', {
      name,
      candidates,
      date,
      commission,
      tick,
      currencies,
      refund,
      subEvents,
      mainName,
    });
    this.setState(this.initialState);
    this.setState({ subEvents: [] });
  };

  handleChangeSubEvent = index => event => {
    let { subEvents } = this.state;
    subEvents[index] = event;
    this.setState({ subEvents });
  };

  handleRemoveSubEvent = index => () => {
    let { subEvents } = this.state;

    subEvents.splice(index, 1);
    this.setState({ subEvents });
  };

  addSubEvent = e => {
    const { subEvents } = this.state;
    e.preventDefault();
    subEvents.push(this.subEventDefault);

    this.setState({ subEvents });
  };

  getResultData = data => {
    const { name, startTime, endTime, period: bcd, commission, tick, currency, updateDate, refund } = data;
    const candidates = data.candidates.filter(candidate => Boolean(candidate));
    const start = startTime.valueOf();
    const end = endTime.valueOf();
    const update = updateDate.valueOf();
    const date = { start, end, bcd, update };

    return {
      name,
      candidates,
      date,
      commission,
      tick,
      currencies: currency.value.toUpperCase(),
      refund: refund.value,
    };
  };

  isDisabled(data) {
    const { name, period, commission, tick, currency, subEvents = [], mainName } = data;

    return (
      !name ||
      !period ||
      !commission ||
      !tick ||
      !currency ||
      (subEvents.length > 0 && !subEvents.map(item => this.isDisabled(item)).some(item => !item)) ||
      (subEvents.length > 0 && !mainName)
    );
  }

  get subEventDefault() {
    return {
      name: '',
      startTime: moment(),
      endTime: moment().add(1, 'days'),
      updateDate: moment().add(1, 'days'),
      period: 0,
      commission: 0,
      tick: 0,
      currency: '',
      candidates: ['up', 'down', 'equal'],
      refund: '',
    };
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
      subEvents,
      mainName,
    } = this.state;
    const symbols = this.props.symbols.map(value => ({ value, label: value }));
    const disabled = this.isDisabled(this.state);

    return (
      <form className="add-event-form" onSubmit={this.handleSubmit}>
        <div className="event-section-inner">
          <div className="event-section-header">
            Add an Forex Event{' '}
            <button className="btn btn-primary add-sub-event" onClick={this.addSubEvent}>
              Add sub event
            </button>
          </div>
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
            {subEvents.length > 0 && (
              <div className="input-group">
                <label htmlFor="mainName">Main Name</label>
                <input
                  type="text"
                  id="mainName"
                  name="mainName"
                  value={mainName}
                  placeholder="Required"
                  onChange={this.handleChange}
                />
              </div>
            )}
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
              <label htmlFor="period">Bet Cancelation Delay</label>
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
                  />
                </div>
              ))}
            </div>
            {subEvents.map((event, index) => (
              <AddSubForexEventForm
                event={event}
                onChange={this.handleChangeSubEvent(index)}
                onRemove={this.handleRemoveSubEvent(index)}
                index={index}
                key={index}
                symbols={symbols}
              />
            ))}
            <div className="input-group">
              <input
                type="submit"
                id="btn-add-event"
                name="btn-add-event"
                disabled={disabled}
                className={'btn btn-primary' + (disabled ? ' disabled' : '')}
                value="Add Forex Event"
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default AddForexEventForm;
