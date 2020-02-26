import React, { Component } from 'react';
import PageLayout from '../../layouts/page';
import Content from './components/content';

class AddEvent extends Component {
  render() {
    return (
      <div className="add-event-page">
        <PageLayout header="New Event Panel" content={<Content />} />
      </div>
    );
  }
}

export default AddEvent;
