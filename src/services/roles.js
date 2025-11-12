import api from "./api";

export const getAllRoles = async () => {
  const { data } = await api.get("/Rol");
  return data;
};
