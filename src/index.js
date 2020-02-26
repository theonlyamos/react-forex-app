import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import registerServiceWorker from './registerServiceWorker';
import routes from './routes';
import store from './redux/store';
import './index.css';
import './axios.config';

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router routes={routes} history={history} />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
