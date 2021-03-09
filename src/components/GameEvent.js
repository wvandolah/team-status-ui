import { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

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
const GameEvent = ({
  showPast,
  setShowPast,
  gameData,
  smsDelivered,
  resend,
  handleDelete,
  handleClick,
  playerData,
}) => {
  const classes = useStyles();
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (gameData) {
      setGames(
        gameData.sort((a, b) => {
          const timeA = new Date(a.dateTime);
          const timeB = new Date(b.dateTime);
          return timeA - timeB;
        }),
      );
    }
  }, [gameData]);

  const highlightClicked = (game, inOut) => {
    return game.players.reduce(
      (acc, curr) => (curr.id && curr.status === inOut ? (acc = 'contained') : acc),
      'outlined',
    );
  };

  const pastGame = (gameTime) => {
    const timeA = new Date(gameTime);
    const timeB = new Date();
    timeB.setDate(timeB.getDate() - 1);
    return timeA >= timeB;
  };
  return (
    <>
      <Grid container spacing={3}>
        <Grid container item xs={12} justify="flex-end">
          {playerData && (
            <Grid item xs={12}>
              <Typography variant="h4">
                {playerData.playerName}'s availability for team {playerData.teamName}
              </Typography>
            </Grid>
          )}
          <Grid item>
            <FormControlLabel
              control={
                <Switch checked={showPast} onChange={() => setShowPast(!showPast)} color="primary" name="pastGames" />
              }
              label="Show Past Games"
            />
          </Grid>
        </Grid>
        {games.map((game) => (
          <Grid key={game.gameId} item xs={12} xl={6}>
            <Paper className={classes.paper} elevation={1}>
              <Grid container spacing={3}>
                <Grid item>
                  <Typography variant="subtitle1" gutterBottom>
                    Game Time:
                    {new Date(game.dateTime).toLocaleString('en-US', {
                      timeZone: 'America/Chicago',
                    })}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Opponent: {game.opponentName}
                  </Typography>
                </Grid>
                {playerData && pastGame(game.dateTime) && (
                  <Grid container spacing={3} item xs={12}>
                    <Grid item>
                      <Button
                        variant={highlightClicked(game, 'In')}
                        color="primary"
                        onClick={() => handleClick('In', game)}
                      >
                        in
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant={highlightClicked(game, 'Out')}
                        color="secondary"
                        onClick={() => handleClick('Out', game)}
                      >
                        out
                      </Button>
                    </Grid>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>First Name</TableCell>
                          <TableCell align="right">Last Initial</TableCell>
                          <TableCell align="right">Type</TableCell>
                          <TableCell align="right">Status</TableCell>
                          {smsDelivered && <TableCell align="right">Sms Delivered</TableCell>}
                          {resend && <TableCell align="right">Resend</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {game &&
                          game.players.map((player) => (
                            <TableRow key={player.id}>
                              <TableCell component="th" scope="row">
                                {player.firstName}
                              </TableCell>
                              <TableCell align="right">{player.lastName}</TableCell>
                              <TableCell align="right">{player.type}</TableCell>
                              <TableCell align="right">{player.status ? player.status : 'No Response'}</TableCell>
                              {smsDelivered && <TableCell align="right">{smsDelivered(player)}</TableCell>}
                              {resend && (
                                <TableCell align="right">
                                  <IconButton onClick={() => resend(player, game.gameId, game.dateTime)}>
                                    <SendIcon color="primary" />
                                  </IconButton>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                {game.attendance && (
                  <Grid item xs={12} sm={6} md={4}>
                    <TableContainer component={Paper}>
                      <Table aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>In</TableCell>
                            <TableCell align="right">Out</TableCell>
                            <TableCell align="right">No Response</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row">
                              {game.attendance.in}
                            </TableCell>
                            <TableCell align="right">{game.attendance.out}</TableCell>
                            <TableCell align="right">{game.attendance.noResponse}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                )}
                {handleDelete && (
                  <Grid container item xs={12}>
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
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default GameEvent;
