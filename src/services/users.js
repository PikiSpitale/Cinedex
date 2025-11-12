import api from "./api";

export const getAllUsers = (params = {}) =>
  api.get("/user", { params }).then((res) => res.data);

export const getUserById = (id) =>
  api.get(`/User/${id}`).then((res) => res.data);
