import React, { PureComponent } from 'react';
import PageLayout from '../../layouts/page';
import Content from './components/content';

class Payment extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="balance-page">
        <PageLayout header="Settings" content={<Content />} socket={this.props.socket} router={this.props.router}/>
      </div>
    );
  }
}

export default Payment;
