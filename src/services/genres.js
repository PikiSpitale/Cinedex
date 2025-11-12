import api from "./api";

export const getAllGenres = () =>
  api.get("/genre").then((res) => res.data);

export const createGenre = (payload) =>
  api.post("/genre", payload).then((res) => res.data);

export const updateGenre = (id, payload) =>
  api.put(`/genre/${id}`, payload).then((res) => res.data);

export const deleteGenre = (id) =>
  api.delete(`/genre/${id}`).then((res) => res.data);
