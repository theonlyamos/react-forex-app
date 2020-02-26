import EditEventModal from './EditEventModal';
import { connect } from 'react-redux';
import { actions } from '../../../../../redux/modal/actions';
import { actions as forexActions } from '../../../../../redux/forex/actions';

const mapStateToProps = state => ({ event: state.events.subscribeEvent, symbols: state.forex.symbols || [] });

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(actions.closeModal()),
  getForexEventSymbols: () => dispatch(forexActions.fetchForexSymbolsRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditEventModal);
