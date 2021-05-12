import React from 'react';
import { Router } from '@reach/router';

import Layout from '../components/Layout';
import Login from '../components/Login';
import PrivateRoute from '../components/PrivateRoute';

import ASAOverview from '../components/asaoverview';
import ASAManager from '../components/asamanager';
import ASAConfig from '../components/asaconfig';
import Reports from '../components/reports';
import UserSettings from '../components/UserSettings';

const App = () => (
  <Layout>
    <Router>
      <PrivateRoute path="/app/asaoverview" component={ASAOverview} />
      <PrivateRoute path="/app/asamanager/:assetId" component={ASAManager} />
      <PrivateRoute path="/app/asaconfig" component={ASAConfig} />
      <PrivateRoute path="/app/reports" component={Reports} />
      <PrivateRoute path="/app/usersettings" component={UserSettings} />
      <Login path="/app/login" />
    </Router>
  </Layout>
);

export default App;
