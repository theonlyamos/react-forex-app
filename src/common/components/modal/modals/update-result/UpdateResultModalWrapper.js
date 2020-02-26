import UpdateResultModal from './UpdateResultModal';
import { connect } from 'react-redux';
import { actions } from '../../../../../redux/modal/actions';

const mapStateToProps = state => ({ event: state.events.subscribeEvent });

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(actions.closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateResultModal);
