export const getAuthHeader = () => {
  let auth = "bearer ";
  const token = localStorage.getItem("token");
  return auth + token;
};
