import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { formatTime, formatTimer } from '../../common/utils/formatters';
import { isMobile } from '../../common/utils/mobile-check.util';
import moment from 'moment';

import './EventPageLayout.css';

class EventPageLayout extends Component {
  static propTypes = {
    event: PropTypes.shape({
      id: PropTypes.number.isRequired,
      infos: PropTypes.shape({
        desc: PropTypes.string,
        name: PropTypes.string.isRequired,
      }).isRequired,
      status: PropTypes.shape({
        bcd: PropTypes.number.isRequired,
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired,
        ended: PropTypes.bool.isRequired,
        open: PropTypes.bool.isRequired,
        started: PropTypes.bool.isRequired,
      }).isRequired,
      results: PropTypes.isRequired,
    }),
    content: PropTypes.element,
    user: PropTypes.object.isRequired,
    showUpdateResultModal: PropTypes.func.isRequired,
    showEditEventModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { event: { status: { bcd, start, end, ended, start_date } = {} } = {} } = props;
    this.state = { bcd, start, end, ended, timer: null, start_date };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { event: { status: { bcd, start, end, ended, update } = {} } = {} } = nextProps;
    const state = { bcd, start, end, ended };
    state.update = update ? ((update - new Date().getTime()) / 1000) | 0 : null;

    return state;
  }

  componentDidMount() {
    const { timer } = this.state;
    const {
      event: { results = [] },
    } = this.props;

    if (results.length === 0 && !timer) {
      setTimeout(() => this.runTick());
    }
  }

  componentWillUnmount() {
    const { timer } = this.state;
    clearInterval(timer);
  }

  runTick = () => {
    const timer = setInterval(() => {
      let { bcd, start, end, timer, update } = this.state;
      const { event } = this.props;

      if (!event) {
        return;
      }

      if (end < 0 && !update && timer) {
        return clearInterval(timer);
      }

      bcd--;
      start--;
      end--;

      this.setState({ bcd, start, end });
      update && this.setState({ update: --update });
    }, 1000);

    this.setState({ timer });
  };

  render() {
    const {
      event: {
        infos: { name },
      },
      event,
      content,
      user,
      showUpdateResultModal,
      showEditEventModal,
    } = this.props;

    const { bcd, start, end, ended, update, start_date } = this.state;
    const isResults = event.results.length > 0;

    return (
      <div className="event-page-layout">
        <div className="event-page-layout__header">
          <div className="event-page-layout__header-item">
            <span className="event-page-layout__name">{name}</span>
            {!isResults && (
              <Fragment>
                {user.account_type === 'ADMIN' &&
                  event.type === 'EVENT' &&
                  ((ended && (
                    <div className="event-page-layout__update-result" onClick={showUpdateResultModal}>
                      <div className="btn btn-primary">{isMobile ? 'Update' : 'Update Results'}</div>
                    </div>
                  )) || (
                    <div className="event-page-layout__update-event" onClick={showEditEventModal}>
                      <div className="btn btn-primary">{isMobile ? 'Edit' : 'Edit Event'}</div>
                    </div>
                  ))}
              </Fragment>
            )}
            {user.account_type === 'ADMIN' &&
              event.type === 'FOREX_EVENT' && (
                <Fragment>
                  <div className="event-page-layout__update-event" onClick={showEditEventModal}>
                    <div className="btn btn-primary">{isMobile ? 'Edit' : 'Edit Event'}</div>
                  </div>
                  <div className="event-timers">
                    <div className="event-end">
                      <strong key="startdate">Start Date: {moment(start_date).format('llll')}</strong>
                    </div>
                    <div className="event-end">
                      <strong key="currency">Currencies: {event.currencies}</strong>
                    </div>
                  </div>
                </Fragment>
              )}
          </div>
          {!isResults && (
            <div className="event-page-layout__header-item text-right">
              {(start > 0 && [
                bcd > start && (
                  <div className="event-page-layout__event-bcd" key="delay">
                    Bet cancelation delay: <span>{formatTime(bcd - start)}</span>
                  </div>
                ),
                <div className="event-timers" key="timers">
                  <div className="event-start">
                    event starts in: <span>{formatTimer(start)}</span>
                  </div>
                  <div className="event-end">
                    event ends in: <span>{formatTimer(end)}</span>
                  </div>
                  {update && (
                    <div className="event-end">
                      event updates in: <span>{formatTimer(update)}</span>
                    </div>
                  )}
                </div>,
              ]) || [
                bcd > 0 ? (
                  <div className="event-page-layout__event-bcd" key="Bet cancelation delay">
                    Bet cancelation delay: <span>{formatTimer(bcd)}</span>
                  </div>
                ) : (
                  <div className="event-page-layout__event-bcd" key="Bets for this event cannot be canceled">
                    Bets for this event cannot be canceled
                  </div>
                ),
                <div className="event-timers" key={end}>
                  <div className="event-end">
                    {end > 0 ? (
                      <Fragment>
                        event ends in:<span>{formatTimer(end)}</span>
                      </Fragment>
                    ) : (
                      <Fragment>Event over</Fragment>
                    )}
                  </div>
                  {update && (
                    <div className="event-end">
                      event updates in: <span>{formatTimer(update)}</span>
                    </div>
                  )}
                </div>,
              ]}
            </div>
          )}
        </div>
        <div className="event-page-layout__content">{content}</div>
      </div>
    );
  }
}

export default EventPageLayout;
