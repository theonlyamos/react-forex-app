import React, { Component } from 'react';
import SocketService from '../../../../services/socket.service';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import '../../../../../pages/add-event/components/add-event-form/AddEventForm.css';
import { isMobile } from '../../../../utils/mobile-check.util';

class EditEventForm extends Component {
  constructor(props) {
    super(props);

    const {
      commission,
      status: { start_date, end_date, period },
      infos: { name },
    } = props.event;

    const candidates = props.event.candidates.map(item => item.name);

    this.state = {
      commission,
      period,
      name,
      startTime: moment(start_date),
      endTime: moment(end_date),
      candidates,
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

  addCandidate = e => {
    const { candidates } = this.state;
    candidates.push('');

    this.setState({ candidates });
  };

  handleSubmit = e => {
    const { onSubmit } = this.props;
    const { name, startTime, endTime, period: bcd, commission } = this.state;
    const candidates = this.state.candidates.filter(candidate => Boolean(candidate));
    const start = startTime.valueOf();
    const end = endTime.valueOf();
    const date = { start, end, bcd };
    const { id, type } = this.props.event;

    e.preventDefault();
    SocketService.send('update_event', { name, candidates, date, commission, id, type });
    onSubmit && onSubmit();
  };

  handleDeleteCandidate = index => () => {
    let { candidates } = this.state;

    candidates.splice(index, 1, '');
    this.setState({ candidates });
  };

  get disabled() {
    const { name, period, candidates, commission } = this.state;
    return !name || !period || !commission || candidates.filter(candidate => Boolean(candidate)).length < 2;
  }

  render() {
    const { name, startTime, endTime, period, candidates = [], commission } = this.state;

    return (
      <form className="add-event-form" onSubmit={this.handleSubmit}>
        <div className="event-section-inner">
          <div className="event-section-header">Edit Event</div>
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
              {candidates.map((candidate, index) => {
                const _candidate = this.props.event.candidates[index];
                const isDisabled = this.props.event.bets.some(
                  bet => _candidate && bet.candidate_id === _candidate.id,
                );

                return (
                  <div className="input-group" key={index}>
                    <label htmlFor={index + 1}>Candidate #{index + 1}</label>
                    <input
                      type="text"
                      id={index + 1}
                      name={index}
                      placeholder="Required"
                      value={candidate}
                      disabled={isDisabled}
                      onChange={this.handleCandidateChange}
                    />
                    {!isDisabled &&
                      candidate && (
                        <i className="far fa-trash-alt" onClick={this.handleDeleteCandidate(index)} />
                      )}
                  </div>
                );
              })}
            </div>
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
            <div className="input-group">
              <input
                type="submit"
                id="btn-add-event"
                name="btn-add-event"
                disabled={this.disabled}
                className={'btn btn-primary' + (this.disabled ? ' disabled' : '')}
                value="Update Event"
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export default EditEventForm;
