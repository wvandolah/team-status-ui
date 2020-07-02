import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import Typography from '@material-ui/core/Typography';
import Header from './Header';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { getStatus, postUpdateStatus } from '../utils/service';

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
}));
const UpdateStatus = () => {
  let query = useQueryParam();
  const classes = useStyles();
  const [playerData, setPlayerData] = useState({});
  const [postError, setPostError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const teamId = query.get('t');
  const playerId = query.get('p');
  const gameId = query.get('g');
  const { status, data, error } = useQuery([teamId, { gameId: gameId, playerId: playerId }], getStatus);

  useEffect(() => {
    if (data && data.response.Count > 0) {
      const gameData = data.response.Items[0];
      setPlayerData({
        teamName: gameData.teamName,
        gameTime: new Date(gameData.dateTime).toLocaleString('en-US'),
        playerName: `${gameData.players[playerId].firstName} ${gameData.players[playerId].lastName}`,
        currentStatus: gameData.players[playerId].status,
        opponentName: gameData.opponentName,
      });
    }
  }, [data, playerId]);

  const handleClick = async (status) => {
    const request = {
      playerId,
      teamId,
      gameId,
      status,
    };
    try {
      const response = await postUpdateStatus(request);
      if (response.status === 201) {
        setSubmitted(true);
      } else {
        setPostError(response);
      }
    } catch (e) {
      console.error(e.response);
      if (e.response.data && e.response.data.response && e.response.data.response.error) {
        setPostError(e.response.data.response.error);
      }
    }
  };

  const validGameUpdate = () =>
    submitted ? (
      <div>Response Submitted, revisit link to update status</div>
    ) : (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Will {playerData.playerName} be playing with team {playerData.teamName} on {playerData.gameTime}
            {playerData.opponentName ? ` vs ${playerData.opponentName}` : ''}?
          </Typography>
        </Grid>
        {playerData.currentStatus === 'Out' || playerData.currentStatus === 'In' ? (
          <Grid item xs={12}>
            <Typography variant="subtitle1">Current Response: {playerData.currentStatus}</Typography>
          </Grid>
        ) : (
          <></>
        )}

        <Grid item xs={3}>
          <Button variant="contained" color="primary" onClick={() => handleClick('In')}>
            in
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="secondary" onClick={() => handleClick('Out')}>
            out
          </Button>
        </Grid>
      </Grid>
    );

  const invalidGameUPdate = () => <div>This Game has been canceled or rescheduled </div>;
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
          {data.response.Count > 0 ? validGameUpdate() : invalidGameUPdate()}
        </Container>
      </main>
    </>
  );
};

export default UpdateStatus;
