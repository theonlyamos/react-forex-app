import MainLayout from './layouts/main';
import LoginPage from './pages/login';
import NotFoundPage from './pages/404';
import RegisterPage from './pages/register';
import DashboardLayout from './layouts/dashboard';
import AboutUsPage from './pages/about-us';
import TermsAndConditionsPage from './pages/terms-and-conditions';
import PrivacyAndPolicyPage from './pages/privacy-and-policy';
import ConfirmRegisterPage from './pages/confirm-register';
import ForgotPassPage from './pages/forgot-pass';
import { default as PagesRoutes } from './pages/routes';

const routes = [
  {
    path: '/',
    component: MainLayout,
    childRoutes: [
      {
        path: 'login',
        component: LoginPage,
      },
      {
        path: 'register',
        component: RegisterPage,
      },
      {
        path: 'dashboard',
        component: DashboardLayout,
        childRoutes: PagesRoutes,
      },
      {
        path: 'about-us',
        component: AboutUsPage,
      },
      {
        path: 'terms-and-conditions',
        component: TermsAndConditionsPage,
      },
      {
        path: 'privacy-and-policy',
        component: PrivacyAndPolicyPage,
      },
      {
        path: 'confirm-register/:token',
        component: ConfirmRegisterPage,
      },
      {
        path: 'forgot-pass',
        component: ForgotPassPage,
      },
      {
        path: 'forgot-pass/:token',
        component: ForgotPassPage,
      },
    ],
  },
  {
    path: '*',
    component: NotFoundPage,
  },
];

export default routes;
