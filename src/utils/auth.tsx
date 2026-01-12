export const isAuthenticated = (): boolean => {
  return localStorage.getItem("isAuth") === "true";
};

export const logout = () => {
  localStorage.removeItem("isAuth");
};
