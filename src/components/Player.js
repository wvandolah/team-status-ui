import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  disabledInput: {
    color: theme.palette.text.primary,
  },
  checkBox: {
    color: theme.palette.warning.dark,
  },
}));

const types = [
  {
    value: 'full',
    label: 'Full Time',
  },
  {
    value: 'sub',
    label: 'Substitute',
  },
];

const Player = ({ person, removePlayer, updatePlayer, edit, handleChecked, isSendStatus, isChecked }) => {
  const [player, setPlayer] = useState(person);
  const [isEdit, setIsEdit] = useState(false);
  const [requiredMet, setRequiredMet] = useState({
    phoneNumber: { error: false, message: '' },
    firstName: { error: false, message: '' },
  });
  const classes = useStyles();

  useEffect(() => {
    if (person.firstName === '' && person.firstName.length < 1) {
      setIsEdit(true);
    }
    setPlayer(person);
  }, [person]);

  const handleChange = (e) => {
    const targetName = e.target.name;
    let targetValue = e.target.value;
    if (e.target.type === 'checkbox') {
      targetValue = e.target.checked;
      if (isSendStatus) {
        updatePlayer({ ...player, [targetName]: targetValue });
      }
    }
    setPlayer({ ...player, [targetName]: targetValue });
  };

  const handleUpdatePlayer = () => {
    let errors = { ...requiredMet };
    if (player.firstName.length < 0) {
      errors.firstName = { error: true, message: 'First Name is Required' };
    } else if (!player.phoneNumber || player.phoneNumber.replace(/\D/g, '').length !== 10) {
      errors.phoneNumber = { error: true, message: 'Not a valid phone number' };
    } else {
      setIsEdit(false);
      updatePlayer(player);
      errors = {
        phoneNumber: { error: false, message: '' },
        firstName: { error: false, message: '' },
      };
    }
    setRequiredMet(errors);
  };

  const handleCancel = () => {
    setPlayer(person);
    updatePlayer(person);
    setIsEdit(false);
  };

  // If a team is saved but a player is still unsaved, the player is reverted to last save
  useEffect(() => {
    if (isEdit && !edit) {
      handleCancel();
    }
    // eslint-disable-next-line
  }, [edit, isEdit]);

  if (!player) {
    return <></>;
  }
  return (
    <>
      <Typography variant="subtitle1" gutterBottom>
        Player Info
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            name="firstName"
            label="First name"
            value={player.firstName}
            onChange={handleChange}
            fullWidth
            disabled={!isEdit}
            error={requiredMet.firstName.error}
            helperText={requiredMet.firstName.message}
            InputProps={{ classes: { disabled: classes.disabledInput } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="lastName"
            label="Last name"
            value={player.lastName ? player.lastName : ''}
            onChange={handleChange}
            fullWidth
            disabled={!isEdit}
            InputProps={{ classes: { disabled: classes.disabledInput } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            name="type"
            label="Type"
            value={player.type ? player.type : ''}
            onChange={handleChange}
            disabled={!isEdit}
            fullWidth
            InputProps={{ classes: { disabled: classes.disabledInput } }}
          >
            {types.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="phoneNumber"
            label="Phone Number"
            value={player.phoneNumber ? player.phoneNumber : ''}
            onChange={handleChange}
            fullWidth
            disabled={!isEdit}
            InputProps={{ classes: { disabled: classes.disabledInput } }}
            error={requiredMet.phoneNumber.error}
            helperText={requiredMet.phoneNumber.message}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="email"
            label="Email Address"
            value={player.email ? player.email : ''}
            onChange={handleChange}
            fullWidth
            disabled={!isEdit}
            InputProps={{ classes: { disabled: classes.disabledInput } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={player.sendEmail ? player.sendEmail : false}
                onChange={handleChange}
                color="primary"
                name="sendEmail"
                disabled={isSendStatus ? false : !isEdit}
              />
            }
            label="Send Email"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={player.sendText ? player.sendText : false}
                onChange={handleChange}
                color="primary"
                name="sendText"
                disabled={isSendStatus ? false : !isEdit}
              />
            }
            label="Send Text"
          />
        </Grid>
        {isEdit ? (
          <>
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" color="primary" onClick={handleUpdatePlayer}>
                Save
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </Grid>
          </>
        ) : (
          <>
            {isSendStatus ? (
              <>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={isChecked} onChange={handleChecked} name={player.id} />}
                    label="Include Player"
                    className={classes.checkBox}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={12} sm={6}>
                  <Button variant="outlined" color="primary" onClick={() => setIsEdit(true)} disabled={!edit}>
                    Edit
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button variant="outlined" color="secondary" onClick={() => removePlayer(player.id)} disabled={!edit}>
                    Delete
                  </Button>
                </Grid>
              </>
            )}
          </>
        )}
      </Grid>
    </>
  );
};

export default Player;
