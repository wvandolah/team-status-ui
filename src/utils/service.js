import axios from 'axios';

const url = process.env.REACT_APP_AUTH0_backEnd;
export const getTeam = async (teamId, { userId }) => {
  const { data } = await axios.get(`${url}teamPlayers?userId=${userId}&teamId=${teamId}`);
  return data;
};

export const getTeams = async (userId) => {
  const { data } = await axios.get(`${url}teamPlayers?userId=${userId}`);
  return data;
};

export const postTeam = async (team) => {
  const { data } = await axios.post(`${url}teamPlayers`, team);
  return data;
};

export const postNotifications = (teamData) => {
  return axios.post(`${url}status`, teamData);
};

export const getStatus = async (teamId, { gameId }) => {
  const { data } = await axios.get(`${url}status?teamId=${teamId}&gameId=${gameId}`);
  return data;
};

export const getStatuses = async (teamId) => {
  const { data } = await axios.get(`${url}status?teamId=${teamId}`);
  return data;
};

export const postUpdateStatus = async (body) => {
  const data = await axios.put(`${url}playerStatus`, body);
  console.log(data);
  return data;
};
