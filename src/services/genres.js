import api from "./api";

export const getAllGenres = () =>
  api.get("/genre").then((res) => res.data);
