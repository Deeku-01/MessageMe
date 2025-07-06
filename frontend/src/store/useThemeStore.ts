import { create } from "zustand";

export interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light",
  setTheme: (theme: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
    set({ theme });
  },
}));