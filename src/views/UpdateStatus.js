import { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, queryCache } from 'react-query';
import Header from '../components/Header';
import { getStatus, postUpdateStatus } from '../utils/service';
import { useSnackbar } from 'notistack';
import GameEvent from '../components/GameEvent';
import Toolbar from '@material-ui/core/Toolbar';

const useQueryParam = () => {
  return new URLSearchParams(useLocation().search);
};

const useStyles = makeStyles((theme) => {
  return {
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
    },
  };
});
const UpdateStatus = () => {
  let query = useQueryParam();
  const classes = useStyles();
  const [playerData, setPlayerData] = useState({});
  const [postError, setPostError] = useState('');
  const [showPast, setShowPast] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const teamId = query.get('t');
  const playerId = query.get('p');
  const { status, data, error } = useQuery([teamId, { playerId: playerId, historic: showPast }], getStatus);
  const [mutate] = useMutation(postUpdateStatus, {
    onError: () => {
      enqueueSnackbar(`Something Went wrong`, { variant: 'error' });
    },
    onSettled: () => {
      queryCache.invalidateQueries([teamId, { playerId: playerId, historic: showPast }]);
    },
    onSuccess: () => {
      enqueueSnackbar(`Response Submitted, revisit link to update status`, {
        variant: 'success',
      });
    },
  });

  useEffect(() => {
    if (data && data.response.Count > 0) {
      const gameData = data.response.Items[0];
      const player = gameData.players.filter((p) => p.id === playerId)[0];
      setPlayerData({
        teamName: gameData.teamName,
        playerName: `${player.firstName} ${player.lastName}`,
        playerId: playerId,
      });
    }
  }, [data, playerId]);

  const handleClick = async (clickedStatus, clickedGame) => {
    const preventReClick = clickedGame.players.reduce(
      (acc, cur) => (cur.id && cur.status === clickedStatus ? (acc = true) : acc),
      false,
    );
    const request = {
      playerId,
      teamId,
      gameId: clickedGame.gameId,
      status: clickedStatus,
    };
    try {
      if (!preventReClick) {
        mutate(request);
      }
    } catch (e) {
      if (e.response.data && e.response.data.response && e.response.data.response.error) {
        setPostError(e.response.data.response.error);
      }
    }
  };

  if (status === 'loading') {
    return <div>loading</div>;
  } else if (status === 'error') {
    return <div>{error.message}</div>;
  } else if (postError !== '') {
    return <div>{postError}</div>;
  }
  return (
    <>
      <Header noMenu />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg">
          <GameEvent
            showPast={showPast}
            setShowPast={setShowPast}
            gameData={data.response.Items}
            handleClick={handleClick}
            playerData={playerData}
          />
        </Container>
      </main>
    </>
  );
};

export default UpdateStatus;
