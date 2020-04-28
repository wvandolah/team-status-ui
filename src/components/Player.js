import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
const Player = ({ person, removePlayer, updatePlayer }) => {
  const [player, setPlayer] = useState(person);
  const handleChange = (e) => {
    setPlayer({ ...player, [e.target.name]: e.target.value });
  };
  if (!player) {
    return <></>;
  }
  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Player
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            value={player.firstName}
            onChange={handleChange}
            fullWidth
            autoComplete="fname"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            value={player.lastName}
            onChange={handleChange}
            fullWidth
            autoComplete="lname"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="type"
            name="type"
            label="Type"
            value={player.type}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            value={player.phoneNumber}
            onChange={handleChange}
            fullWidth
            autoComplete="phone"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="email"
            name="email"
            label="Email Address"
            value={player.email}
            onChange={handleChange}
            fullWidth
            autoComplete="email"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Button variant="outlined" color="primary" onClick={() => updatePlayer(player)}>
            Save
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="outlined" color="secondary" onClick={() => removePlayer(player.id)}>
            Delete
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Player;
