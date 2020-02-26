import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import AuthService from '../../services/auth.service';
import SocketService from '../../services/socket.service';
import { isMobile } from '../../utils/mobile-check.util';
import { slide as Menu } from 'react-burger-menu';
import { decode } from '../../utils/jwt.util';
import Sidebar from '../sidebar';

import './Header.css';

class Header extends PureComponent {
  constructor(props) {
    super(props);

    this.socket = props.socket
    this.socket.on('updateUserStatus', function(data){
      if(this.props.user && this.props.user.id === data.user_id){
        this.handleLogout();
      }
    }.bind(this));
  }

  static propTypes = {
    router: PropTypes.object.isRequired,
    user: PropTypes.shape({
      email: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }),
    logout: PropTypes.func.isRequired,
  };

  state = { isShowMobileSideBar: false };

  get isShowMenu() {
    const { user } = this.props;

    return isMobile && user;
  }

  isMenuOpen = state => {
    this.setState({ isShowMobileSideBar: state.isOpen });
  };

  handleLogout = () => {
    const { router, logout, setUser } = this.props;
    var adminToken = AuthService.adminToken;

    if(!adminToken){
      logout && logout();
      AuthService.logout();
      SocketService.close();
      setTimeout(() => router.push('/'), 100);  
    }else{
      setUser(decode(adminToken));
      AuthService.accessToken = adminToken;
      AuthService.removeAdminAccess();
    }    
  };

  handleChooseItem = () => this.setState({ isShowMobileSideBar: !this.state.isShowMobileSideBar });

  render() {
    const { user, isSocketError, socket } = this.props;
    var adminToken = AuthService.adminToken;
    return (
      <div className="header">
        {this.isShowMenu && (
          <Fragment>
            <i className={'fas fa-bars' + (isSocketError ? ' hide' : '')} onClick={this.handleChooseItem} />
            <Menu onStateChange={this.isMenuOpen} isOpen={this.state.isShowMobileSideBar && !isSocketError}>
              <Sidebar onChooseItem={this.handleChooseItem} socket={ socket }/>
            </Menu>
          </Fragment>
        )}
        <div className="header__content">
          <Link
            to="/"
            className={
              'header_link header_block header_logo-link ' +
              (isSocketError ? 'm-l-0' : '') +
              (AuthService.isAuth && this.isShowMenu ? ' m-l--50' : '')
            }
          >
            <img src="/img/brand.png" className="header_logo" alt="brand" />
          </Link>
          <div className={'pull-right header_block' + (user ? ' absolute' : '')}>
            {!user && (
              <Fragment>
                <Link to="/login" className="btn btn-primary header_link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-actioncall header_link">
                  Join now
                </Link>
              </Fragment>
            )}
            {user && (
              <Fragment>
                {!isMobile && (
                  <Link to="/dashboard" className="header__user">
                    <span>{user.username}</span>
                    <span>(</span>
                    <span>{user.email}</span>
                    <span>)</span>
                  </Link>
                )}
                { !adminToken && 
                  <a className="btn btn-secondary" onClick={this.handleLogout}>
                    Logout
                  </a>
                }
                { adminToken && 
                  <a className="btn btn-secondary" onClick={this.handleLogout}>
                    Back to admin
                  </a>
                }
              </Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
