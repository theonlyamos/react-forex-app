import { connect } from 'react-redux';
import Content from './Content';
import { actions } from '../../../../redux/forex/actions';

const mapStateToProps = state => ({ symbols: state.forex.symbols || [] });
const mapDispatchToProps = dispatch => ({
  getForexEventSymbols: () => dispatch(actions.fetchForexSymbolsRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Content);
