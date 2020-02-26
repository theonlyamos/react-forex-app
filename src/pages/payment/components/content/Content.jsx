import React, { PureComponent, Fragment } from 'react';
import { Tabs } from '../../../../common/components/tabs';
import { AddPayments } from '../add-payment';
import { ListPayments } from '../list-payment';
import './Content.css';

class Content extends PureComponent {
  constructor(props) {
    super(props);

    this.socket = props.socket
    this.socket.on('updatePayments', function(data){
      if(this.state.list_payments && data){
        this.state.list_payments.fetchPayments();
      }
    }.bind(this));
  }

  initialState = {
    list_payments: '',
  };

  state = this.initialState;
  componentDidMount() {
    this.setState({ list_payments: this.refs.list_payments });
  }

  render() {
    return (
      <Fragment>
        <div className="">
          <div className="event-section">
            <Tabs headers={['add payment method', 'list']} panels={[
              <AddPayments props={this.props}/>,
              <ListPayments ref="list_payments" props={this.props}/>
            ]} />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Content;
