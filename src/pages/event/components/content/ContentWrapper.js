import { connect } from 'react-redux';
import { actions as eventActions } from '../../../../redux/events/actions';
import Content from './Content';

const mapStateToProps = state => ({
  estimation: state.events.runtimeCalculationEvent.earning,
  risk: state.events.runtimeCalculationEvent.risk,
  safe: state.events.runtimeCalculationEvent.safe,
  balance: state.user.balance,
  chart: state.events.chart,
});
const mapDispatchToProps = dispatch => ({
  updateRuntimeCalculationEvent: () => dispatch(eventActions.updateRuntimeCalculationEvent(null)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
