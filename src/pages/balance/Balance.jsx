import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Content from './components/content';
import PageLayout from '../../layouts/page';
import './Balance.css';

class Balance extends PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="balance-page">
        <PageLayout header="Balance Overview" content={<Content />} socket={this.props.socket} router={this.props.router}/>
      </div>
    );
  }
}

export default Balance;
