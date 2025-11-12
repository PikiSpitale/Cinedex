import { create } from "zustand";
import { persist } from "zustand/middleware";

const handler = (set) => ({
  token: "",
  user: null,
  isAuthenticated: false,

  login: (data) =>
    set({ token: data.token, user: data.user, isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, token: "", user: null }),
});

export const useAuthStore = create(
  persist(handler, {
    name: "auth-store",
  })
);
