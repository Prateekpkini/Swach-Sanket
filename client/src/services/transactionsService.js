import api from "./api";

// 🧩 GET /api/transactions?dateKey=YYYY-MM-DD
export const getTransactionsByDate = async (dateKey) => {
  try {
    const res = await api.get(`/api/transactions?dateKey=${dateKey}`);
    return res.data.transactions || [];
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_id");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};

// 🧩 POST /api/transactions
export const createTransaction = async (transactionData) => {
  try {
    const res = await api.post(`/api/transactions`, transactionData);
    return res.data.transaction;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_id");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};

// 🧩 GET /api/transactions/history?limit=30
export const getTransactionsHistory = async (limit = 30) => {
  try {
    const res = await api.get(`/api/transactions/history?limit=${limit}`);
    return res.data.transactions || [];
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_id");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};

// 🧩 DELETE /api/transactions/:id
export const deleteTransaction = async (id) => {
  try {
    const res = await api.delete(`/api/transactions/${id}`);
    return res.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_email");
      localStorage.removeItem("user_name");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_id");
      window.location.href = "/login";
      throw new Error("Session expired. Please login again.");
    }
    throw error;
  }
};

