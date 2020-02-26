import AddEvent from './AddEvent';
import { connect } from 'react-redux';

const mapStateToProps = state => ({ user: state.user });
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AddEvent);
