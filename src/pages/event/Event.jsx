import React from 'react';
import { ContentComponent, HistoryContentComponent } from './components';
import EventPageLayout from '../../layouts/event-page';

const EventWrapper = ({ event, user, chart }) =>
  event && (
    <EventPageLayout
      content={
        event.results.length === 0 ? (
          <ContentComponent event={event} />
        ) : (
          <HistoryContentComponent event={event} user={user} chart={chart} />
        )
      }
      event={event}
    />
  );

export default EventWrapper;
