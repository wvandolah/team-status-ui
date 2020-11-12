import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import { getStatuses, deleteStatuses, resendNotifications } from '../utils/service';
import { useQuery, useMutation, queryCache } from 'react-query';
import Typography from '@material-ui/core/Typography';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 450,
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    paddingTop: theme.spacing(2),
  },
}));

const CheckStatus = ({ location, history }) => {
  const { status, data, error } = useQuery(location.state.teamId, getStatuses, {
    enabled: location.state.teamId !== '',
  });
  const classes = useStyles();
  const [deleteError, setDeleteError] = useState('');
  const [games, setGames] = useState([]);
  const [showPast, setShowPast] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [deleteMutate] = useMutation(deleteStatuses, {
    onError: (err) => {
      enqueueSnackbar(err.response, { variant: 'error' });
    },
    onSuccess: () => {
      enqueueSnackbar(`Delete successfully`, {
        variant: 'success',
      });
      queryCache.invalidateQueries(location.state.teamId);
    },
  });

  const [resendMutate] = useMutation(resendNotifications, {
    onError: (err) => {
      let returnMsg = err.message ? `Resend failed: ${err.message}` : 'Something unexpected happened while resending';
      enqueueSnackbar(returnMsg, { variant: 'error' });
    },
    onSuccess: () => {
      enqueueSnackbar(`Resent successfully`, {
        variant: 'success',
      });
    },
  });
  useEffect(() => {
    if (data) {
      setGames(
        data.response.Items.filter((game) => {
          const timeA = new Date(game.dateTime);
          const timeB = new Date();
          timeB.setDate(timeB.getDate() - 1);
          return showPast ? true : timeA >= timeB;
        }).sort((a, b) => {
          const timeA = new Date(a.dateTime);
          const timeB = new Date(b.dateTime);
          return timeA - timeB;
        }),
      );
    }
  }, [data, showPast]);

  const handleDelete = (gameId) => {
    const deleteBody = {
      teamId: location.state.teamId,
      gameId: gameId,
    };
    deleteMutate(deleteBody);
  };

  const resend = (player, gameId, dateTime) => {
    const resendBody = {
      teamId: location.state.teamId,
      teamName: location.state.teamName,
      gameId: gameId,
      dateTime: dateTime,
      players: [player],
    };
    resendMutate(resendBody);
  };

  const smsDelivered = (row) => {
    if (!('smsDelivered' in row)) {
      return <></>;
    }
    const delivered = row.smsDelivered;
    if (delivered === 'success') {
      return <ThumbUpIcon color="primary" />;
    } else if (delivered === 'failed') {
      return <ThumbDownIcon color="secondary" />;
    } else {
      return <HourglassEmptyIcon color="secondary" />;
    }
  };

  if (status === 'loading') {
    return <div>loading</div>;
  } else if (status === 'error') {
    return <div>{error.message}</div>;
  } else if (data && games.length < 1) {
    return <div>No Game games scheduled</div>;
  }
  return (
    <Grid container spacing={3}>
      <Grid container item xs={12} justify="flex-end">
        <Grid item>
          <FormControlLabel
            control={
              <Switch checked={showPast} onChange={() => setShowPast(!showPast)} color="primary" name="pastGames" />
            }
            label="Show Past Games"
          />
        </Grid>
      </Grid>
      {games.map((game, i) => (
        <Grid key={game.gameId} item xs={12} xl={6}>
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="subtitle1" gutterBottom>
              Game Time: {game.dateTime}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Opponent: {game.opponentName}
            </Typography>

            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>First Name</TableCell>
                    <TableCell align="right">Last Name</TableCell>
                    <TableCell align="right">Type</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Sms Delivered</TableCell>
                    <TableCell align="right">Resend</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {game &&
                    Object.values(game.players).map((row) => (
                      <TableRow key={row.id}>
                        <TableCell component="th" scope="row">
                          {row.firstName}
                        </TableCell>
                        <TableCell align="right">{row.lastName}</TableCell>
                        <TableCell align="right">{row.type}</TableCell>
                        <TableCell align="right">{row.status ? row.status : 'No Response'}</TableCell>
                        <TableCell align="right">{smsDelivered(row)}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => resend(row, game.gameId, game.dateTime)}>
                            <SendIcon color="primary" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            {game.attendance &&
              Object.keys(game.attendance).map((att) => (
                <Grid key={att} item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    {att}: {game.attendance[att]}
                  </Typography>
                </Grid>
              ))}

            <Grid item xs={3} className={classes.button}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(game.gameId)}
                name={game.gameId}
              >
                Delete
              </Button>
            </Grid>
            <Grid item xs={12} className={classes.button}>
              <Typography variant="subtitle2">Delete will notify players if game is in future</Typography>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default CheckStatus;
