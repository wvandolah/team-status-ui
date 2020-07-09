import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Player from './Player';
import { postTeam } from '../utils/service';
import { makeStyles } from '@material-ui/core';
import shortid from 'shortid';
import { useMutation, queryCache } from 'react-query';
import { useSnackbar } from 'notistack';

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
  grid: {
    padding: theme.spacing(2),
  },
  addButton: {
    margin: theme.spacing(2),
  },
}));
const Team = ({ team, removeEditTemp, history }) => {
  const [players, setPlayers] = useState(team.players);
  const [playersUpdated, setPlayersUpdated] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(false);
  const [teamName, setTeamName] = useState(team.teamName);
  const [editName, setEditName] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [saveError, setSaveError] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [mutate] = useMutation(postTeam, {
    onMutate: (newTeam) => {
      const previousTeams = queryCache.getQueryData(team.userId);
      removeEditTemp(team.teamId);
      let update = false;
      queryCache.setQueryData(team.userId, (old) => {
        const cacheTeams = old.response.Items.map((t) => {
          if (t.teamId === newTeam.teamId) {
            update = true;
            return newTeam;
          } else {
            return t;
          }
        });
        if (!update) cacheTeams.push(newTeam);
        old.response.Items = cacheTeams;
        return old;
      });
      return () => queryCache.setQueryData(team.userId, previousTeams);
    },
    onError: (err, newTeam, rollback) => {
      enqueueSnackbar(`Something went wrong`, { variant: 'error' });
      return rollback();
    },
    onSettled: () => {
      queryCache.invalidateQueries(team.userId);
    },
    onSuccess: () => {
      enqueueSnackbar(`Successfully Submitted`, {
        variant: 'success',
      });
      setPlayersUpdated(false);
      setEditName(false);
      removeEditTemp(team.teamId);
    },
  });

  useEffect(() => {
    if (team.teamName === '' && team.teamName.length < 1) {
      setExpanded(true);
      setEditName(true);
    }
  }, [team]);

  useEffect(() => {
    if (!editName && !playersUpdated) {
      setTeamName(team.teamName);
      setPlayers(team.players);
    }
  }, [editName, playersUpdated, team]);

  const handleTeamName = (e) => {
    setTeamName(e.target.value);
  };

  const addPlayer = () => {
    setEditingPlayer(true);
    setPlayers([...players, { ...newPlayer, id: shortid.generate() }]);
  };

  const removePlayer = (id) => {
    const playerRemoved = players.filter((player) => player.id !== id);
    setPlayers(playerRemoved);
  };

  const updatePlayer = (updatedPlayer) => {
    const withUpdated = players.map((player) => (player.id === updatedPlayer.id ? updatedPlayer : player));
    setPlayers(withUpdated);
    setEditingPlayer(false);
    setPlayersUpdated(true);
  };

  const handleTeamSave = (event) => {
    event.stopPropagation();
    if (editName) {
      if (players.length > 0) {
        const updateTeam = {
          teamName,
          userId: team.userId,
          teamId: team.teamId,
          players,
        };
        setSaveError('');
        mutate(updateTeam);
      } else {
        setSaveError('Team must include one or more players');
      }
    } else {
      setEditName(true);
    }
  };

  return (
    <ExpansionPanel expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
        <Grid container spacing={3}>
          <Grid item sm={12} md={6}>
            <TextField
              required
              error={saveError.length > 0}
              name="teamName"
              label="Team name"
              value={teamName}
              onChange={handleTeamName}
              disabled={!editName}
              onClick={(event) => event.stopPropagation()}
              onFocus={(event) => event.stopPropagation()}
              fullWidth
              InputProps={{ classes: { disabled: classes.disabledInput } }}
              helperText={saveError}
            />
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={(event) => handleTeamSave(event)}
              onFocus={(event) => event.stopPropagation()}
              disabled={editingPlayer}
            >
              {!editName ? 'Edit' : 'Save'}
            </Button>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={(event) => {
                history.push('/home/send', team);
                event.stopPropagation();
              }}
              onFocus={(event) => event.stopPropagation()}
              disabled={editingPlayer || editName}
            >
              Send
            </Button>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={(event) => {
                history.push('/home/status', { teamId: team.teamId, teamName: teamName });
                event.stopPropagation();
              }}
              onFocus={(event) => event.stopPropagation()}
              disabled={editingPlayer || editName}
            >
              Status
            </Button>
          </Grid>
        </Grid>
      </ExpansionPanelSummary>
      <Grid container spacing={3} className={classes.grid}>
        {players.map((player) => (
          <Grid key={player.id} item sm={12} md={6}>
            <Paper className={classes.paper} elevation={3}>
              <Player person={player} removePlayer={removePlayer} updatePlayer={updatePlayer} edit={editName} />
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={addPlayer} disabled={!editName}>
            Add Player
          </Button>
        </Grid>
      </Grid>
    </ExpansionPanel>
  );
};

export default Team;
