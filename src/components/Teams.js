import React, { useState } from 'react';
import Team from './Team';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { v4 as uuid } from 'uuid';
import { useQuery } from 'react-query';
import { useAuth0 } from '../react-auth0-spa';
import { getTeams } from '../utils/service';

const newTeam = {
  teamName: '',
  players: [],
};

const Teams = (props) => {
  const { user, loading } = useAuth0();
  const [teams, setTeams] = useState([]);

  const userSub = loading ? '' : user.sub;
  const { status, data, error } = useQuery(userSub, getTeams);

  const addTeam = () => {
    setTeams([...teams, { ...newTeam, teamId: uuid(), userId: userSub }]);
  };
  const removeEditTemp = (teamId) => {
    const savedEditRemoved = teams.filter((team) => team.teamId !== teamId);
    setTeams(savedEditRemoved);
  };

  if (status === 'loading' || loading) {
    return <div>loading</div>;
  } else if (status === 'error') {
    return <div>{error.message}</div>;
  }

  return (
    <Grid container spacing={3}>
      {[...data.response.Items, ...teams].map((team) => (
        <Grid key={team.teamId} item xs={12}>
          <Team {...props} team={team} removeEditTemp={removeEditTemp}></Team>
        </Grid>
      ))}
      <Grid item xs={6}>
        <Button variant="contained" color="primary" onClick={addTeam}>
          Add Team
        </Button>
      </Grid>
    </Grid>
  );
};

export default Teams;
