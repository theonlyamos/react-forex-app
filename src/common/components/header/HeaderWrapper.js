import Header from './Header';
import { connect } from 'react-redux';
import { actions } from '../../../redux/user/actions';
import { SOCKET_CLOSED } from '../modal';

const mapStateToProps = state => ({
  user: state.user.id ? state.user : null,
  isSocketError: state.modal.type === SOCKET_CLOSED,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(actions.userLogout()),
  setUser: user => dispatch(actions.fetchUserSuccess(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
