import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import request from '../services/request';

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  console.log('Private Route');
  if (!request.isLoggedIn() && location.pathname !== '/app/login') {
    // If we’re not logged in, redirect to the home page.
    console.log('We are not logged in');
    navigate('/app/login');
    return null;
  }
  console.log('We are logged in');
  return <Component {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

export default PrivateRoute;
