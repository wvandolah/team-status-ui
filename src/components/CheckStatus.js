import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { getStatuses, deleteStatuses } from '../utils/service';
import { useQuery, useMutation, queryCache } from 'react-query';
import Typography from '@material-ui/core/Typography';

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
  const { status, data, error } = useQuery(location.state, getStatuses);
  const classes = useStyles();
  const [deleteError, setDeleteError] = useState('');

  const [mutate] = useMutation(deleteStatuses, {
    onError: (error) => {
      console.log(error.response);
      setDeleteError(error.response.statusText);
    },
    onSuccess: () => {
      queryCache.refetchQueries(location.state);
    },
  });
  console.log(location.state);
  useEffect(() => {
    if (data) {
      data.response.Items.sort((a, b) => {
        const timeA = new Date(a.dateTime);
        const timeB = new Date(b.dateTime);
        return timeB - timeA;
      });
    }
  }, [data]);

  const handleDelete = (gameId) => {
    const deleteBody = {
      teamId: location.state,
      gameId: gameId,
    };
    mutate(deleteBody);
  };

  if (status === 'loading') {
    return <div>loading</div>;
  } else if (status === 'error') {
    return <div>{error.message}</div>;
  } else if (data && data.response.Count < 1) {
    setTimeout(() => {
      history.push('/home');
    }, 2000);
    return <div>No status updates have been sent</div>;
  }
  return (
    <Grid container spacing={3}>
      {deleteError !== '' ? <div> {deleteError} </div> : <></>}
      {data.response.Items.map((game) => (
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
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {game &&
                    Object.values(game.players).map((row) => (
                      <TableRow key={row.lastName}>
                        <TableCell component="th" scope="row">
                          {row.firstName}
                        </TableCell>
                        <TableCell align="right">{row.lastName}</TableCell>
                        <TableCell align="right">{row.status ? row.status : 'No Response'}</TableCell>
                        <TableCell align="right">{row.type}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
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
              <Typography variant="subtitle2">Will notify players if game is in future</Typography>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default CheckStatus;
