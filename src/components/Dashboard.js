import React, { useState } from 'react';
import { Route } from 'react-router-dom';
import Header from './Header';
import SideBar from './SideBar';
import Profile from './Profile';
import Teams from './Teams';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import SendStatus from './SendStatus';
import CheckStatus from './CheckStatus';

const useStyles = makeStyles((theme) => {
  return {
    content: {
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    },
    appBarSpacer: theme.mixins.toolbar,
    container: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
  };
});
const Dashboard = ({ match }) => {
  const [open, setOpen] = useState(true);
  const classes = useStyles();
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
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Route path={`${match.path}`} component={Teams} exact />
          <Route path={`${match.path}/profile`} component={Profile} />
          <Route path={`${match.path}/send`} component={SendStatus} />
          <Route path={`${match.path}/status`} component={CheckStatus} />
        </Container>
      </main>
    </>
  );
};

export default Dashboard;
