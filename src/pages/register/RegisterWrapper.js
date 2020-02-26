import Register from './Register';
import { connect } from 'react-redux';
import { actions } from '../../redux/user/actions';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(actions.fetchUserSuccess(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
