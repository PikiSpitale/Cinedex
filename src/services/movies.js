import api from "./api";

export const getAllMovies = (params = {}) =>
  api.get("/movie", { params }).then((res) => res.data);

export const getMovieById = (id) =>
  api.get(`/movie/${id}`).then((res) => res.data);

export const createMovie = (payload) =>
  api.post("/movie", payload).then((res) => res.data);

export const updateMovie = (id, payload) =>
  api.put(`/movie/${id}`, payload).then((res) => res.data);

export const deleteMovie = (id) =>
  api.delete(`/movie/${id}`).then((res) => res.data);
