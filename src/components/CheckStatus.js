import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { getStatuses } from '../utils/service';
import { useQuery } from 'react-query';
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
}));

const CheckStatus = ({ location, history }) => {
  const { status, data, error } = useQuery(location.state, getStatuses);
  const classes = useStyles();

  useEffect(() => {
    if (data) {
      data.response.Items.sort((a, b) => {
        const timeA = new Date(a.dateTime);
        const timeB = new Date(b.dateTime);
        return timeB - timeA;
      });
      console.log(data.response.Items);
    }
  }, [data]);
  console.log(data, status);

  if (status === 'loading') {
    return <div>loading</div>;
  } else if (status === 'error') {
    return <div>{error.message}</div>;
  } else if (data && data.response.Count < 1) {
    setTimeout(() => {
      history.push('/home');
    }, 500);
    return <div>No status updates have been sent</div>;
  }
  return (
    <Grid container spacing={3}>
      {data.response.Items.map((game) => (
        <Grid key={game.gameId} item xs={12} xl={6}>
          <Paper className={classes.paper} elevation={1}>
            <Typography variant="subtitle1" gutterBottom>
              {new Date(game.dateTime).toLocaleString('en-US')}
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
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default CheckStatus;
