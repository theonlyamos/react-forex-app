import Modal from './Modal';
import { connect } from 'react-redux';
import { actions } from '../../../redux/modal/actions';

const mapStateToProps = state => ({ ...state.modal });

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(actions.closeModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
