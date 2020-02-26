import React, { Component, Fragment } from 'react';
import { Link } from 'react-router';

class Links extends Component {
  state = { show: false, chosenEvent: null };

  toggle = eventId => () => this.setState({ show: !this.state.show, chosenEvent: eventId });

  handleChooseItem = (event, choseEvent = null) => () => {
    const { onChooseItem, type } = this.props;

    onChooseItem(`${event.infos.name}_${type}_${event.id}`)();
    this.toggle(choseEvent)();
  };

  render() {
    const { show, chosenEvent } = this.state;
    const { events, type, active, onChooseItem, onChooseEvent } = this.props;

    return events.map(event => (
      <Fragment key={event.infos.name + event.id}>
        {event.children.length === 0 && (
          <Link
            to={`/dashboard/${type}/${event.id}`}
            className="sidebar__link"
            onClick={onChooseEvent(event.id, event.type)}
          >
            <li
              className={
                'sidebar__item sidebar__sub-item ' +
                (active === `${event.infos.name}_${type}_${event.id}` ? 'active' : '')
              }
              onClick={onChooseItem(`${event.infos.name}_${type}_${event.id}`)}
            >
              <div className="title">{event.infos.name}</div>
            </li>
          </Link>
        )}
        {event.children.length > 0 && (
          <Fragment>
            <li
              className={
                'sidebar__item sidebar__sub-item ' +
                ((show && chosenEvent === event.id) ||
                active === `${event.infos.name}_${type}_${event.id}` ||
                event.children.some(child => `${child.infos.name}_${type}_${child.id}` === active)
                  ? 'active'
                  : '')
              }
              onClick={this.toggle(event.id)}
            >
              <div className="title">{event.infos.mainName}</div>
            </li>
            {show &&
              chosenEvent === event.id && (
                <Fragment>
                  <Link
                    to={`/dashboard/${type}/${event.id}`}
                    className="sidebar__link"
                    key={event.infos.name + event.id}
                    onClick={onChooseEvent(event.id, event.type)}
                  >
                    <li
                      className="sidebar__item sidebar__sub-item sidebar_sub-event"
                      onClick={this.handleChooseItem(event, null)}
                    >
                      <div className="title">{event.infos.name}</div>
                    </li>
                  </Link>
                  {event.children.map(child => (
                    <Link
                      to={`/dashboard/${type}/${child.id}`}
                      className="sidebar__link"
                      key={child.infos.name + child.id}
                      onClick={onChooseEvent(child.id, child.type)}
                    >
                      <li
                        className="sidebar__item sidebar__sub-item sidebar_sub-event"
                        onClick={this.handleChooseItem(child, null)}
                      >
                        <div className="title">{child.infos.name}</div>
                      </li>
                    </Link>
                  ))}
                </Fragment>
              )}
          </Fragment>
        )}
      </Fragment>
    ));
  }
}

export default Links;
