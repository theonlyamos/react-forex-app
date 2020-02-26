import Sidebar from './Sidebar';
import { connect } from 'react-redux';

const mapStateToProps = state => ({ user: state.user, events: state.events });

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
