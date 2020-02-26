import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { formatMoney } from '../../utils/formatters';
import SocketService from '../../services/socket.service';
import RouterService from '../../services/router.service';
import { isMobile } from '../../utils/mobile-check.util';
import Links from './Links';
import axios from 'axios';

import './Sidebar.css';

class Sidebar extends Component {

  static propTypes = {
    user: PropTypes.shape({
      balance: PropTypes.number,
    }),
  };

  constructor(props) {
    super(props);

    const slugs = window.location.pathname.split('/');
    const prevSlug = slugs[slugs.length - 2];
    const slug = slugs[slugs.length - 1];
    let user_id = props.user.id;

    this.socket = props.socket;
    this.socket.on('updateBalance', function(data){
      if(user_id === data.to_user_id || user_id === data.from_user_id){
        this.fetchBalance();
      }
    }.bind(this));

    (prevSlug === 'incoming' ||
      prevSlug === 'ongoing' ||
      prevSlug === 'over' ||
      prevSlug === 'history' ||
      prevSlug === 'forex') &&
      slug &&
      SocketService.send('subscribe_event', {
        id: slug,
        type: prevSlug === 'forex' ? 'FOREX_EVENT' : 'EVENT',
      });

    this.state = {
      active: 'balance',
      updateBalance: '',
      updateAffiliateBalance: '',
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const slugs = window.location.pathname.split('/');
    const prevSlug = slugs[slugs.length - 2];
    if (
      prevSlug === 'incoming' ||
      prevSlug === 'ongoing' ||
      prevSlug === 'over' ||
      prevSlug === 'history' ||
      prevSlug === 'forex'
    ) {
      const slug = slugs[slugs.length - 1];
      const {
        events: { [prevSlug]: eventList = [] },
      } = nextProps;

      const type =
        RouterService.router.location.state && RouterService.router.location.state.type
          ? RouterService.router.location.state.type
          : null;
      let event = null;

      for (const item of eventList) {
        if (Number(item.id) === Number(slug) && (type ? item.type === type : true)) {
          event = item;

          break;
        }

        const findChild = item.children.find(
          child => Number(child.id) === Number(slug) && (type ? child.type === type : true),
        );

        if (findChild) {
          event = findChild;

          break;
        }
      }

      return { active: event && `${event.infos.name}_${prevSlug}_${slug}`, slug };
    }

    const active = slugs[slugs.length - 1];

    return { active };
  }

  handleChooseItem = active => () => {
    this.props.onChooseItem && this.props.onChooseItem();
    this.setState({ active });
  };

  handleChooseEvent = (id, type) => () => SocketService.send('subscribe_event', { id, type });

  fetchBalance = () => {
    axios.get('/api/me/profile?type=balance')
    .then( response => {
      let data = response.data.data;
      this.setState({ updateBalance: data.balance, updateAffiliateBalance: data.affiliate_balance })
    })
  }

  render() {
    let { active, updateBalance, updateAffiliateBalance } = this.state;
    let {
      user: { balance, account_type, affiliate_balance },
      events: { incoming = [], ongoing = [], over = [], history = [] },
    } = this.props;
    let forex = this.props.events.forex || [];
    let isAdmin = account_type === 'ADMIN';

    return (
      <ul className="sidebar">
        <div className="menu-item">
          <Link to="/dashboard/balance" className="sidebar__link">
            <div className="item">
              <li
                className={'sidebar__item ' + (active === 'balance' ? 'active' : '')}
                onClick={this.handleChooseItem('balance')}
              >
                <span className="balance__label">Balance:</span>
                <span className="balance__value" id="balance_value">{updateBalance ? formatMoney(updateBalance) : formatMoney(balance)}</span>
              </li>
            </div>
          </Link>
        </div>
        <div className="menu-item">
          <Link to="/dashboard/balance" className="sidebar__link">
            <div className="item">
              <li
                className={'sidebar__item ' + (active === 'affiliate_balance' ? 'active' : '')}
                onClick={this.handleChooseItem('affiliate_balance')}
              >
                <span className="balance__label">Affiliate Balance:</span>
                <span className="balance__value" id="balance_value">{updateAffiliateBalance ?  formatMoney(updateAffiliateBalance) : formatMoney(affiliate_balance)}</span>
              </li>
            </div>
          </Link>
        </div>
        {(isMobile || !isMobile) && (isAdmin && (
          <div className="menu-item">
            <Link to="/dashboard/payment" className="sidebar__link">
              <div className="item">
                <li
                  className={'sidebar__item ' + (active === 'payment' ? 'active' : '')}
                  onClick={this.handleChooseItem('payment')}
                >
                  <span className="balance__label">Payment</span>
                </li>
              </div>
            </Link>
          </div>
        ))}
        {(isMobile || !isMobile) && (isAdmin && (
          <div className="menu-item">
            <Link to="/dashboard/setting" className="sidebar__link">
              <div className="item">
                <li
                  className={'sidebar__item ' + (active === 'setting' ? 'active' : '')}
                  onClick={this.handleChooseItem('setting')}
                >
                  <span className="balance__label">Setting</span>
                </li>
              </div>
            </Link>
          </div>
        ))}
        <div className="sidebar__events-list">
          {incoming.length > 0 && (
            <li className="sidebar__item sidebar__item_no-hover">
              <div className="title">Incoming</div>
            </li>
          )}
          <Links
            events={incoming}
            type="incoming"
            active={active}
            onChooseItem={this.handleChooseItem}
            onChooseEvent={this.handleChooseEvent}
          />
          {ongoing.length > 0 && (
            <li className="sidebar__item sidebar__item_no-hover">
              <div className="title">Ongoing</div>
            </li>
          )}
          <Links
            events={ongoing}
            type="ongoing"
            active={active}
            onChooseItem={this.handleChooseItem}
            onChooseEvent={this.handleChooseEvent}
          />
          {forex.length > 0 && (
            <li className="sidebar__item sidebar__item_no-hover">
              <div className="title">Forex Events</div>
            </li>
          )}
          <Links
            events={forex}
            type="forex"
            active={active}
            onChooseItem={this.handleChooseItem}
            onChooseEvent={this.handleChooseEvent}
          />
          {over.length > 0 && (
            <li className="sidebar__item sidebar__item_no-hover">
              <div className="title">Waiting for results</div>
            </li>
          )}
          <Links
            events={over}
            type="over"
            active={active}
            onChooseItem={this.handleChooseItem}
            onChooseEvent={this.handleChooseEvent}
          />
          {history.length > 0 && (
            <li className="sidebar__item sidebar__item_no-hover">
              <div className="title">History</div>
            </li>
          )}
          <Links
            events={history}
            type="history"
            active={active}
            onChooseItem={this.handleChooseItem}
            onChooseEvent={this.handleChooseEvent}
          />
          {(isMobile || !isMobile) &&
            (isAdmin && (
              <div className="sidebar__admin">
                <Link to="/dashboard/add-event" className="sidebar__link">
                  <li
                    className={'sidebar__item ' + (active === 'add-event' ? 'active' : '')}
                    onClick={this.handleChooseItem('add-event')}
                  >
                    <div className="title center">Add Event</div>
                  </li>
                </Link>
              </div>
            ))}
        </div>
      </ul>
    );
  }
}

export default Sidebar;
