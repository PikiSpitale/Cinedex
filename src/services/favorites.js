import api from "./api";

export const getFavorites = () => api.get("/favorites").then((res) => res.data);

export const addFavorite = (movieId) => api.post("/favorites", { movieId });

export const removeFavorite = (movieId) => api.delete(`/favorites/${movieId}`);
