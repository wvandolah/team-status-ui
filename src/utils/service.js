import axios from 'axios';

const url = process.env.REACT_APP_AUTH0_backEnd;

export const authAxios = axios.create();
export const getTeam = async (teamId, { userId }) => {
  const { data } = await authAxios.get(`${url}teamPlayers?userId=${userId}&teamId=${teamId}`);
  return data;
};

export const getTeams = async (userId) => {
  const { data } = await authAxios.get(`${url}teamPlayers?userId=${userId}`);
  return data;
};

export const postTeam = async (team) => {
  const { data } = await authAxios.post(`${url}teamPlayers`, team);
  return data;
};

export const postNotifications = (teamData) => {
  return authAxios.post(`${url}status`, teamData);
};

export const getStatus = async (teamId, { gameId, playerId }) => {
  const { data } = await axios.get(`${url}playerStatus`);
  return data;
};

export const getStatuses = async (teamId) => {
  const { data } = await authAxios.get(`${url}status?teamId=${teamId}`);
  return data;
};

export const postUpdateStatus = async (body) => {
  const data = await axios.put(`${url}playerStatus`, body);
  return data;
};

export const deleteStatuses = async (body) => {
  const data = await authAxios.delete(`${url}status`, { data: body });
  return data;
};

export const resendNotifications = async (player) => {
  const data = await authAxios.post(`${url}resend`, player);
  return data;
};
