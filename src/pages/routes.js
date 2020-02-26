import BalancePage from './balance';
import AddEventPage from './add-event';
import EventPage from './event';
import PaymentPage from './payment';
import SettingPage from './setting';

const routes = [
  {
    path: 'balance',
    component: BalancePage,
  },
  {
    path: 'add-event',
    component: AddEventPage,
  },
  {
    path: 'incoming/:id',
    component: EventPage,
  },
  {
    path: 'ongoing/:id',
    component: EventPage,
  },
  {
    path: 'over/:id',
    component: EventPage,
  },
  {
    path: 'history/:id',
    component: EventPage,
  },
  {
    path: 'forex/:id',
    component: EventPage,
  },
  {
    path: 'payment',
    component: PaymentPage,
  },
  {
    path: 'setting',
    component: SettingPage,
  },
];

export default routes;
