import store from '../../redux/store';
import { actions as userActions } from '../../redux/user/actions';
import { actions as modalActions } from '../../redux/modal/actions';
import { actions as eventActions } from '../../redux/events/actions';
import { SOCKET_CLOSED } from '../components/modal';
import RouterService from './router.service';

const { REACT_APP_WEB_SOCKET_HOST, REACT_APP_WEB_SOCKET_PORT } = process.env;

class SocketService {
  static get uri() {
    return `ws://${REACT_APP_WEB_SOCKET_HOST}:${REACT_APP_WEB_SOCKET_PORT}`;
  }

  static get isInitialed() {
    return Boolean(this.socket);
  }

  static init(token) {
    this.socket = new WebSocket(`${this.uri}/${token}`, 'gameserver');
    this.onOpen();
    this.onClose();
    this.onError();
    this.onMessage();
  }

  static onOpen() {
    this.socket.onopen = () => {
      console.log('socket on open');
    };
  }

  static onClose() {
    this.socket.onclose = event => {
      if (event.wasClean) {
        console.log('connection closed without problem');
      } else {
        console.log('connection closed with fatal error');
      }

      store.dispatch(
        eventActions.updateEventList({ over: [], incoming: [], ongoing: [], history: [], forex: [] }),
      );
      console.log(`status: ${event.code} reason: ${event.reason}`);
    };
  }

  static onError(error) {
    this.socket.onerror = error => {
      console.log('Error ' + error.message);
      store.dispatch(modalActions.showModal(SOCKET_CLOSED, 'Connection Lost.'));
    };
  }

  static onMessage() {
    this.socket.onmessage = event => {
      const { type, data } = JSON.parse(event.data);
      switch (type) {
        case 'balance_update':
          const { balance } = data;
          store.dispatch(userActions.updateBalance(balance));

          break;

        case 'disconnect':
          const { reason } = data;
          let message = '';

          reason === 'invalid__token' &&
            (message += 'Disconnected: Invalid token. Try to Login again on the website.');
          reason === 'invalid__user' && (message += 'Disconnected: Invalid user account.');
          reason === 'duplicate' && (message += 'Disconnected: Connected somewhere else.');

          !message && (message += 'Disconnected: Connection Lost.');

          setTimeout(() => store.dispatch(modalActions.showModal(SOCKET_CLOSED, message)));

          break;
        case 'event_list':
          const {
            over,
            open: { incoming, ongoing, forex },
            history = [],
          } = data;
          store.dispatch(eventActions.updateEventList({ over, incoming, ongoing, history, forex }));

          break;
        case 'subscription':
        case 'subscription_update':
          store.dispatch(eventActions.updateSubscribeEvent(data));
          store.dispatch(eventActions.updateRuntimeCalculationEvent(null));

          break;
        case 'runtime_calculate_event':
          store.dispatch(eventActions.updateRuntimeCalculationEvent(data));

          break;
        case 'subscribe_event_rejected': {
          const { reason } = data;

          if (reason === 'event_notfound') {
            RouterService.push('/dashboard/balance');
          }

          break;
        }

        case 'unsubscribed': {
          RouterService.push('/dashboard/balance');

          break;
        }
        case 'update_chart':
          store.dispatch(eventActions.updateForexEventChart(data));

          break;
        default:
          console.log(type, data);
      }
    };
  }

  static send(type, data) {
    if (!this.socket || !this.socket.readyState) {
      return setTimeout(() => this.send(type, data));
    }

    this.socket.send(JSON.stringify({ type, data }));
  }

  static close() {
    this.socket.close();
    this.socket = null;
  }
}

export default SocketService;
