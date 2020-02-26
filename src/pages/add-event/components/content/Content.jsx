import React, { PureComponent } from 'react';
import { Tabs } from '../../../../common/components/tabs';
import { AddForm } from '../add-event-form';
import { AddForexForm } from '../add-forex-event-form';
import {
  Tab as ReactTab,
  Tabs as ReactTabs,
  TabList as ReactTabList,
  TabPanel as ReactTabPanel,
} from 'react-tabs';

import './Content.css';
import 'react-tabs/style/react-tabs.css';

const AddAGenerator = () => <div />;
const ManageGenerator = () => <div />;

class Content extends PureComponent {
  static propTypes = {};

  constructor(props) {
    super(props);

    props.getForexEventSymbols();
  }

  render() {
    return (
      <div className="add-event-content">
        <div className="event-sections">
          <div className="add-event-content__section event-section">
            <ReactTabs defaultIndex={0}>
              <ReactTabList>
                <ReactTab>Event</ReactTab>
                <ReactTab>Forex Event</ReactTab>
              </ReactTabList>
              <ReactTabPanel>
                <AddForm />
              </ReactTabPanel>
              <ReactTabPanel>
                <AddForexForm symbols={this.props.symbols} />
              </ReactTabPanel>
            </ReactTabs>
          </div>
        </div>
        <div className="event-sections">
          <div className="event-section">
            <Tabs
              headers={['Add a Generator', 'Manage Generator']}
              panels={[<AddAGenerator />, <ManageGenerator />]}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Content;
