import React, { PureComponent } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import './AddEventForm.css';

class AddSubEventForm extends PureComponent {
  handleChange = ({ target: { name, value } }) => {
    const { onChange, event } = this.props;
    onChange && onChange({ ...event, [name]: value });
  };

  handleDateChange = field => date => {
    const { onChange, event } = this.props;
    onChange && onChange({ ...event, [field]: date });
  };

  handleChangeRaw = field => ({ target: { value } }) => {
    const date = new Date(value);
    const { onChange, event } = this.props;
    date !== 'Invalid Date' && onChange && onChange({ ...event, [field]: moment(date) });
  };

  handleCandidateChange = ({ target: { name, value } }) => {
    const { onChange, event } = this.props;
    let candidates = [...this.props.event.candidates];

    candidates[name] = value;
    onChange && onChange({ ...event, candidates });
  };

  addCandidate = e => {
    const { candidates } = this.props.event;
    const { onChange, event } = this.props;

    candidates.push('');
    onChange && onChange({ ...event, candidates });
  };

  handleRemove = e => {
    const { onRemove } = this.props;

    e.preventDefault();

    onRemove && onRemove();
  };

  render() {
    const { name, startTime, endTime, period, candidates, commission } = this.props.event;

    return (
      <div className="add-sub-event-form">
        <div className="event-section-header">
          Sub Event #{this.props.index + 1}{' '}
          <button className="btn btn-primary add-sub-event" onClick={this.handleRemove}>
            Remove
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
        </div>
      </div>
    );
  }
}

export default AddSubEventForm;
