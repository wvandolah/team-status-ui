import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import history from './utils/history';
import PrivateRoute from './views/PrivateRoute';
import SignInSide from './views/SignInSide';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dashboard from './views/Dashboard';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import UpdateStatus from './views/UpdateStatus';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import green from '@material-ui/core/colors/green';
import indigo from '@material-ui/core/colors/indigo';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
}));

const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
          primary: prefersDarkMode ? green : indigo,
        },
      }),
    [prefersDarkMode],
  );

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router history={history}>
          <Switch>
            <Route path="/" exact component={SignInSide} />
            <Route path="/statusUpdate" component={UpdateStatus} />
            <PrivateRoute path="/home" component={Dashboard} />
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
