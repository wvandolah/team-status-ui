import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, queryCache } from 'react-query';
import Typography from '@material-ui/core/Typography';
import Header from './Header';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { getStatus, postUpdateStatus } from '../utils/service';
import { useSnackbar } from 'notistack';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useQueryParam = () => {
  return new URLSearchParams(useLocation().search);
};

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  appBarSpacer: theme.mixins.toolbar,
  table: {
    paddingTop: theme.spacing(4),
  },
}));
const UpdateStatus = () => {
  let query = useQueryParam();
  const classes = useStyles();
  const [playerData, setPlayerData] = useState({});
  const [postError, setPostError] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [submitted, setSubmitted] = useState(false);
  const teamId = query.get('t');
  const playerId = query.get('p');
  const gameId = query.get('g');
  const { status, data, error } = useQuery([teamId, { gameId: gameId, playerId: playerId }], getStatus);
  const [mutate] = useMutation(postUpdateStatus, {
    onError: () => {
      enqueueSnackbar(`Something Went wrong`, { variant: 'error' });
    },
    onSettled: () => {
      queryCache.invalidateQueries([teamId, { gameId: gameId, playerId: playerId }]);
    },
    onSuccess: () => {
      setSubmitted(true);
      enqueueSnackbar(`Response Submitted, revisit link to update status`, {
        variant: 'success',
      });
    },
  });

  useEffect(() => {
    if (data && data.response.Count > 0) {
      const gameData = data.response.Items[0];
      setPlayerData({
        teamName: gameData.teamName,
        gameTime: new Date(gameData.dateTime).toLocaleString('en-US'),
        playerName: `${gameData.players[playerId].firstName} ${gameData.players[playerId].lastName}`,
        currentStatus: gameData.players[playerId].status,
        opponentName: gameData.opponentName,
        attendanceIn: gameData.attendance.in,
        attendanceOut: gameData.attendance.out,
        attendanceNoResponse: gameData.attendance.noResponse,
      });
    }
  }, [data, playerId]);

  const handleClick = async (clickedStatus) => {
    const request = {
      playerId,
      teamId,
      gameId,
      status: clickedStatus,
    };
    try {
      mutate(request);
    } catch (e) {
      if (e.response.data && e.response.data.response && e.response.data.response.error) {
        setPostError(e.response.data.response.error);
      }
    }
  };

  const validGameUpdate = () => (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Will {playerData.playerName} be playing with team {playerData.teamName} on {playerData.gameTime}
            {playerData.opponentName ? ` vs ${playerData.opponentName}` : ''}?
          </Typography>
        </Grid>
        {playerData.currentStatus === 'Out' || playerData.currentStatus === 'In' ? (
          <Grid item xs={12}>
            <Typography variant="subtitle1">Your Response: {playerData.currentStatus}</Typography>
          </Grid>
        ) : (
          <></>
        )}

        <Grid item xs={3}>
          <Button variant="contained" color="primary" disabled={submitted} onClick={() => handleClick('In')}>
            in
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="secondary" disabled={submitted} onClick={() => handleClick('Out')}>
            out
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={1} className={classes.table}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Team Response </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>In</TableCell>
                  <TableCell align="right">Out</TableCell>
                  <TableCell align="right">No Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {playerData.attendanceIn}
                  </TableCell>
                  <TableCell align="right">{playerData.attendanceOut}</TableCell>
                  <TableCell align="right">{playerData.attendanceNoResponse}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );

  const invalidGameUpdate = () => <div>This Game has been canceled or rescheduled </div>;
  if (status === 'loading') {
    return <div>loading</div>;
  } else if (status === 'error') {
    return <div>{error.message}</div>;
  } else if (postError !== '') {
    return <div>{postError}</div>;
  }
  return (
    <>
      <Header noMenu />
      <main className={classes.container}>
        <Container maxWidth="sm" className={classes.container}>
          {data.response.Count > 0 ? validGameUpdate() : invalidGameUpdate()}
        </Container>
      </main>
    </>
  );
};

export default UpdateStatus;
