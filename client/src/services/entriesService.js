import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
});

// 🧩 GET /api/entries?dateKey=YYYY-MM-DD
export const getEntryByDate = async (dateKey) => {
  const res = await axios.get(`${API_BASE}api/entries?dateKey=${dateKey}`, {
    headers: getAuthHeaders(),
  });
  return res.data.entry || { dateKey, data: {} };
};

// 🧩 PUT /api/entries/:dateKey
export const upsertEntry = async (dateKey, data) => {
  const res = await axios.put(
    `${API_BASE}/api/entries/${dateKey}`,
    { data },
    { headers: getAuthHeaders() }
  );
  return res.data.entry;
};

// 🧩 DELETE /api/entries/:dateKey
export const deleteEntryByDate = async (dateKey) => {
  const res = await axios.delete(`${API_BASE}api/entries/${dateKey}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

// 🧩 GET /api/entries/history?limit=30
export const getEntriesHistory = async (limit = 30) => {
  const res = await axios.get(`${API_BASE}api/entries/history?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  return res.data.entries || [];
};
