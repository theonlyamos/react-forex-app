import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AuthService from '../../common/services/auth.service';
import Header from '../../common/components/header';
import { decode } from '../../common/utils/jwt.util';
import RouterService from '../../common/services/router.service';
import Footer from '../../common/components/footer';
import SocketService from '../../common/services/socket.service';
import io from 'socket.io-client/dist/socket.io';


import './MainLayout.css';

const { IO_HOST } = process.env;

class MainLayout extends PureComponent {
  static propTypes = {
    setUser: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
    router: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    
    const url = window.location.protocal + IO_HOST;
    this.socket = io.connect(url + ':5001');
    const { router, location, setUser } = props;
    RouterService.router = router;

    let check_url = location.pathname;
    check_url = check_url.split('/')[1]
    if (AuthService.isAuth) {
      setUser(decode(AuthService.accessToken));
      !SocketService.isInitialed && SocketService.init(AuthService.accessToken);

      (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || check_url === 'confirm-register' || check_url === 'forgot-pass') &&
        router.push('/dashboard');
    } else {
      if(check_url === 'dashboard'){
        router.push('/');
      }
    }
    const query = location.query
    if(query && query.ref){
      localStorage.setItem('affiliates', query.ref);
    }
  }

  render() {
    const { children, router, location } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { socket: this.socket })
    );
    return (
      <div className="main">
        <div className="main_header">
          <Header router={router} socket={this.socket}/>
        </div>
        {AuthService.isAuth && /\/dashboard/.test(location.pathname) ? (
          childrenWithProps
        ) : (
          <div className="home">{childrenWithProps}</div>
        )}
        <div className="main_footer">
          <Footer />
        </div>
      </div>
    );
  }
}

export default MainLayout;
