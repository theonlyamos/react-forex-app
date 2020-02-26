import Balance from './Balance';
import { connect } from 'react-redux';

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(Balance);
