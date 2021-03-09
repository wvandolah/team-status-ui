import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from './utils/history';
import PrivateRoute from './views/PrivateRoute';
import SignInSide from './views/SignInSide';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from './views/Dashboard';
import { makeStyles } from '@material-ui/core/styles';
import UpdateStatus from './views/UpdateStatus';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
}));
const App = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={SignInSide} />
          <Route path="/statusUpdate" component={UpdateStatus} />
          <PrivateRoute path="/home" component={Dashboard} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
