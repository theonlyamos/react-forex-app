import { connect } from 'react-redux';
import Content from './Content';

const mapStateToProps = state => ({ user: state.user });
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
