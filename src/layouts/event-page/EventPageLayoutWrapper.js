import { connect } from 'react-redux';
import { actions as modalActions } from '../../redux/modal/actions';
import { UPDATE_RESULTS, EDIT_EVENT } from '../../common/components/modal/types';
import EventPageLayout from './EventPageLayout';

const mapStateToProps = state => ({
  user: state.user,
  events: state.events,
});
const mapDispatchToProps = dispatch => ({
  showUpdateResultModal: () => dispatch(modalActions.showModal(UPDATE_RESULTS)),
  showEditEventModal: () => dispatch(modalActions.showModal(EDIT_EVENT)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EventPageLayout);
