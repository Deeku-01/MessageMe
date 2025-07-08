import { create } from "zustand";

export interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

// Get initial theme and apply it to DOM immediately
const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme") || "valentine";
    // Apply theme to DOM immediately on initialization
    document.documentElement.setAttribute("data-theme", savedTheme);
    return savedTheme;
  }
  return "valentine";
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
    set({ theme });
  },
}));