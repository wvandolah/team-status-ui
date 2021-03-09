import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import Profile from './Profile';
import Teams from './Teams';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import SendStatus from './SendStatus';
import CheckStatus from './CheckStatus';
import { useAuth0 } from '../react-auth0-spa';
import { authAxios } from '../utils/service';

const useStyles = makeStyles((theme) => {
  return {
    appBarSpacer: theme.mixins.toolbar,
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
      marginLeft: 0,
    },
  };
});
const Dashboard = ({ match }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { loading, getTokenSilently } = useAuth0();
  useEffect(() => {
    const setToken = async () => {
      const token = await getTokenSilently();
      authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };
    setToken();
  }, [getTokenSilently]);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Header handleDrawerOpen={handleDrawerOpen} open={open} />
      <SideBar handleDrawerClose={handleDrawerClose} open={open} />
      <main>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Route path={`${match.path}`} component={Teams} exact />
              <Route path={`${match.path}/profile`} component={Profile} />
              <Route path={`${match.path}/send`} component={SendStatus} />
              <Route path={`${match.path}/status`} component={CheckStatus} />
            </>
          )}
        </Container>
      </main>
    </>
  );
};

export default Dashboard;
