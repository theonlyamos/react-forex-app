import React, { Component } from 'react';
import SocketService from '../../../../common/services/socket.service';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import AddSubEventForm from './AddSubEventForm';

import 'react-datepicker/dist/react-datepicker.css';
import './AddEventForm.css';

class AddEventForm extends Component {
  initialState = {
    name: '',
    startTime: moment(),
    endTime: moment().add(1, 'days'),
    period: 0,
    commission: 0,
    mainName: '',
    candidates: ['', ''],
    subEvents: [],
  };

  state = this.initialState;

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
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

  addCandidate = e => {
    const { candidates } = this.state;
    candidates.push('');

    this.setState({ candidates });
  };

  addSubEvent = e => {
    const { subEvents } = this.state;
    e.preventDefault();
    subEvents.push(this.subEventDefault);

    this.setState({ subEvents });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { mainName } = this.state;
    const { name, candidates, date, commission } = this.getResultData(this.state);
    const subEvents = this.state.subEvents.map(event => this.getResultData(event));

    SocketService.send('add_event', { name, mainName, candidates, date, commission, subEvents });
    this.setState(this.initialState);
    this.setState({ subEvents: [] });
  };

  getResultData = data => {
    const { name, startTime, endTime, period: bcd, commission } = data;
    const candidates = data.candidates.filter(candidate => Boolean(candidate));
    const start = startTime.valueOf();
    const end = endTime.valueOf();
    const date = { start, end, bcd };

    return { name, candidates, date, commission };
  };

  isDisabled(data) {
    const { name, period, candidates, commission, subEvents = [], mainName } = data;

    return (
      !name ||
      !period ||
      !commission ||
      candidates.filter(candidate => Boolean(candidate)).length < 2 ||
      (subEvents.length > 0 && !subEvents.map(item => this.isDisabled(item)).some(item => !item)) ||
      (subEvents.length > 0 && !mainName)
    );
  }

  get subEventDefault() {
    return {
      name: '',
      startTime: moment(),
      endTime: moment().add(1, 'days'),
      period: 0,
      commission: 0,
      candidates: ['', ''],
    };
  }

  render() {
    const { name, startTime, endTime, period, candidates, commission, subEvents, mainName } = this.state;
    const disabled = this.isDisabled(this.state);

    return (
      <form className="add-event-form" onSubmit={this.handleSubmit}>
        <div className="event-section-inner">
          <div className="event-section-header">
            Add an Event{' '}
            <button className="btn btn-primary add-sub-event" onClick={this.addSubEvent}>
              Add sub event
            </button>
          </div>
          <div className="add-event-form__content event-section-content">
            <div className="input-group">
              <label htmlFor="name">Event Name</label>
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
              <label htmlFor="start-time">Event Starts</label>
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
              <label htmlFor="end-time">Event Ends</label>
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
            {candidates.map((candidate, index) => (
              <div className="input-group" key={index}>
                <label htmlFor={index + 1}>Candidate #{index + 1}</label>
                <input
                  type="text"
                  id={index + 1}
                  name={index}
                  placeholder="Required"
                  value={candidate}
                  onChange={this.handleCandidateChange}
                />
              </div>
            ))}
            <div className="input-group">
              <label htmlFor="add-candidate" />
              <input
                type="button"
                className="add-event-form__add"
                onClick={this.addCandidate}
                name="add-candidate"
                value="+ Add a candidate"
              />
            </div>
            {subEvents.map((event, index) => (
              <AddSubEventForm
                event={event}
                onChange={this.handleChangeSubEvent(index)}
                onRemove={this.handleRemoveSubEvent(index)}
                index={index}
                key={index}
              />
            ))}
            <div className="input-group">
              <input
                type="submit"
                id="btn-add-event"
                name="btn-add-event"
                value="Add Event"
                disabled={disabled}
                className={'btn btn-primary' + (disabled ? ' disabled' : '')}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default AddEventForm;
