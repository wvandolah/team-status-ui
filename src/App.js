import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from './utils/history';
import PrivateRoute from './components/PrivateRoute';
import SignIn from './components/SignIn';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from './components/Dashboard';
import { makeStyles } from '@material-ui/core/styles';

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
          <Route path="/" exact component={SignIn} />
          <PrivateRoute path="/home" component={Dashboard} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
