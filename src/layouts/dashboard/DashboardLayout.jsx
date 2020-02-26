import React, { PureComponent, Fragment } from 'react';
import AuthService from '../../common/services/auth.service';
import Modal from '../../common/components/modal';
import SocketService from '../../common/services/socket.service';
import Sidebar from '../../common/components/sidebar';
import { isMobile } from '../../common/utils/mobile-check.util';

import './DashboardLayout.css';

class DashboardLayout extends PureComponent {

  constructor(props) {
    super(props);
    
    AuthService.isAuth && !SocketService.isInitialed && SocketService.init(AuthService.accessToken);
    !AuthService.isAuth && props.router.push('/');
    props.location.pathname === '/dashboard' && props.router.push('/dashboard/balance');
  }

  render() {
    const { children } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, {socket: this.props.socket})
    );
    return (
      AuthService.isAuth && (
        <Fragment>
          <section className="dashboard">
            {!isMobile && <Sidebar className="dashboard__sidebar" socket={ this.props.socket }/>}
            <div className="dashboard__middle-panel middle-panel">
              <div className="middle-panel__content">{childrenWithProps}</div>
            </div>
          </section>
          <Modal />
        </Fragment>
      )
    );
  }
}

export default DashboardLayout;
