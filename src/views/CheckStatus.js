import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import { getStatuses, deleteStatuses, resendNotifications } from '../utils/service';
import { useQuery, useMutation, queryCache } from 'react-query';
import { useSnackbar } from 'notistack';
import GameEvent from '../components/GameEvent';

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
  const [showPast, setShowPast] = useState(false);
  const { status, data, error } = useQuery([location.state.teamId, { historic: showPast }], getStatuses, {
    enabled: location.state.teamId !== '',
  });
  const classes = useStyles();
  const [deleteError, setDeleteError] = useState('');
  const [games, setGames] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const [deleteMutate] = useMutation(deleteStatuses, {
    onError: (err) => {
      console.log(err.response);
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
        data.response.Items.sort((a, b) => {
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
    <GameEvent
      showPast={showPast}
      setShowPast={setShowPast}
      gameData={data.response.Items}
      smsDelivered={smsDelivered}
      resend={resend}
      handleDelete={handleDelete}
    />
  );
};

export default CheckStatus;
