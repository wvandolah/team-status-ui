import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useAuth0 } from '../react-auth0-spa';
import Player from './Player';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { getTeam, postNotifications } from '../utils/service';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  grid: {
    padding: theme.spacing(2),
  },
  checkBox: {
    paddingTop: theme.spacing(2),
    color: theme.palette.warning.dark,
  },
}));
const SendStatus = ({ location, history }) => {
  const teamId = location.state ? location.state.teamId : '';
  const userId = location.state ? location.state.userId : '';
  const { status, data, error } = useQuery([teamId, { userId: userId }], getTeam);
  const [players, setPlayers] = useState([]);
  const [check, setCheck] = useState({});
  const [hasSent, setHasSent] = useState(false);
  const [opponentName, setOpponentName] = useState('');
  const [sendAllChecked, setSendAllChecked] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());
  const { loading } = useAuth0();
  const classes = useStyles();
  const handleChecked = (event) => {
    if (sendAllChecked) {
      setSendAllChecked(!sendAllChecked);
    }
    setCheck({ ...check, [event.target.name]: event.target.checked });
  };
  const handleSend = async () => {
    try {
      const teamData = data.response.Items[0];
      const sendPlayers = players.filter((player) => check[player.id]);
      const sendData = {
        teamId: teamData.teamId,
        teamName: teamData.teamName,
        opponentName: opponentName,
        dateTime: selectedDate.toLocaleString('en-US'),
        players: sendPlayers,
      };
      const returned = await postNotifications(sendData);
      if (returned.status === 201) {
        setHasSent(true);
      }
    } catch (e) {
      console.error(e.response);
    }
  };

  const updatePlayer = (updatedPlayer) => {
    const withUpdated = players.map((player) => (player.id === updatedPlayer.id ? updatedPlayer : player));
    setPlayers(withUpdated);
  };

  const handleOpponentName = (e) => {
    setOpponentName(e.target.value);
  };

  const handleAllChecked = () => {
    const tempCheck = { ...check };
    data.response.Items[0].players.forEach((player) => (tempCheck[player.id] = !sendAllChecked));
    setCheck(tempCheck);
    setSendAllChecked(!sendAllChecked);
  };

  useEffect(() => {
    if (data && data.response.Items[0]) {
      setPlayers(data.response.Items[0].players);
    }
  }, [data]);

  if (teamId === '') {
    history.push('/home');
  }
  if (status === 'loading' || loading) {
    return <div>loading</div>;
  } else if (status === 'error') {
    return <div>{error.message}</div>;
  } else if (data.response.Items.length < 1) {
    history.push('/home');
    return <div></div>;
  }

  return hasSent ? (
    <div>sent</div>
  ) : (
    <Grid container spacing={3} className={classes.grid}>
      <Grid item xs={12}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            label="DateTimePicker"
            inputVariant="outlined"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </MuiPickersUtilsProvider>
      </Grid>
      <Grid item xs={12}>
        <Grid item xs={6}>
          <TextField
            required
            name="opponentName"
            label="Opponent Name"
            value={opponentName}
            onChange={handleOpponentName}
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            fullWidth
            InputProps={{ classes: { disabled: classes.disabledInput } }}
          />
        </Grid>
        <Grid>
          <FormControlLabel
            control={<Checkbox checked={sendAllChecked} onChange={handleAllChecked} />}
            label="Check All"
            className={classes.checkBox}
          />
        </Grid>
      </Grid>

      {players.map((player) => (
        <Grid key={player.id} item xs={12} sm={6}>
          <Paper className={classes.paper} elevation={3}>
            <Player
              person={player}
              updatePlayer={updatePlayer}
              isSendStatus
              handleChecked={handleChecked}
              isChecked={check[player.id] ? true : false}
            />
          </Paper>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" onClick={handleSend}>
          Send Notification Messages
        </Button>
      </Grid>
    </Grid>
  );
};

export default SendStatus;
