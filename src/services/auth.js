import api from "./api";

export const logIn = (payload) =>
  api.post("/auth/login", payload).then((res) => res.data);

export const logOut = () => api.post("/auth/logout");

export const signUp = (payload) =>
  api.post("/auth/register", payload).then((res) => res.data);

export const updateUserRoles = (userId, rolesIds) =>
  api.put(`/auth/${userId}/roles`, rolesIds).then((res) => res.data);

export const checkAuth = async () => {
  try {
    await api.get("/auth/health");
    return true;
  } catch (err) {
    if (err.response?.status === 401 || err.response?.status === 403)
      return false;
    throw err;
  }
};
