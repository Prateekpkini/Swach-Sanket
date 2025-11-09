// src/services/mrf.js
import api from "./api";

// Entries
export const getEntry = async (dateKey) => {
  const { data } = await api.get(`/api/entries`, { params: { dateKey } });
  return data; // { entry }
};

export const upsertEntry = async (dateKey, payload) => {
  const { data } = await api.put(`/api/entries/${dateKey}`, { data: payload });
  return data; // { entry }
};

export const deleteEntry = async (dateKey) => {
  const { data } = await api.delete(`/api/entries/${dateKey}`);
  return data; // { message, dateKey }
};

export const getHistory = async (limit = 30) => {
  const { data } = await api.get(`/api/entries/history`, { params: { limit } });
  return data; // { entries }
};

// (Optional) Materials & analytics if/when you use them
export const getMaterials = async () => {
  const { data } = await api.get(`/api/materials`);
  return data; // { materials }
};

export const getSevenDayTrend = async () => {
  const { data } = await api.get(`/api/analytics/seven-day-trend`);
  return data; // { trend }
};
