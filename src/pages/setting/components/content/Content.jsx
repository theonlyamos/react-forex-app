import React, { PureComponent, Fragment } from 'react';
import { Tabs } from '../../../../common/components/tabs';
import { MailSmtp } from '../mail-smtp';
import './Content.css';

class Content extends PureComponent {
  render() {
    return (
      <Fragment>
        <div className="">
          <div className="event-section">
            <Tabs headers={['mail smtp']} panels={[
              <MailSmtp props={this.props}/>,
            ]} />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Content;
