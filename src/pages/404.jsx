import React from 'react';
import AuthService from '../common/services/auth.service';

const NotFoundPage = ({ router }) => {
  (AuthService.isAuth && router.push('/dashboard/balance')) || router.push('/');

  return <div />;
};

export default NotFoundPage;
