import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Player from './Player';
import { makeStyles } from '@material-ui/core';
import { v4 as uuid } from 'uuid';

const newPlayer = {
  firstName: '',
  lastName: '',
  phoneNumber: '',
  email: '',
  type: '',
};
const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  disabledInput: {
    color: theme.palette.text.primary,
  },
}));
const Teams = () => {
  const [players, setPlayers] = useState([]);
  const [teamName, setTeamName] = useState('test');
  const [editName, setEditName] = useState(true);
  const classes = useStyles();

  const handleTeamName = (e) => {
    setTeamName(e.target.value);
  };
  const addPlayer = () => {
    setPlayers([...players, { ...newPlayer, id: uuid() }]);
  };
  const removePlayer = (id) => {
    const playerRemoved = players.filter((player) => player.id !== id);
    setPlayers(playerRemoved);
  };
  const updatePlayer = (updatedPlayer) => {
    const withUpdated = players.map((player) => (player.id === updatedPlayer.id ? updatedPlayer : player));
    setPlayers(withUpdated);
  };
  console.log(players);
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            required
            id="teamName"
            name="teamName"
            label="Team name"
            value={teamName}
            onChange={handleTeamName}
            disabled={editName}
            fullWidth
            InputProps={{ classes: { disabled: classes.disabledInput } }}
          />
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" color="primary" onClick={() => setEditName(!editName)}>
            {editName ? 'Edit' : 'Save'}
          </Button>
        </Grid>

        {players.map((player) => (
          <Grid key={player.id} item xs={6}>
            <Paper className={classes.paper}>
              <Player person={player} removePlayer={removePlayer} updatePlayer={updatePlayer} />
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={addPlayer}>
            Add Player
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Teams;
