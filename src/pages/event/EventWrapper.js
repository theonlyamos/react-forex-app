import Event from './Event';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  event: state.events.subscribeEvent,
  user: state.user,
  chart: state.events.chart,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Event);
