"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const ThemeContext = createContext({
  theme: "light",
  setTheme: (t: "light" | "dark") => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(saved);
  }, []);

  useEffect(() => {
    if (!theme) return;

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);

    // 🔥 FORCE Toastify to match the app theme
    toast.updateTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

toast.updateTheme = function (mode) {
  document.documentElement.style.setProperty(
    "--toastify-color-dark",
    "#1f1f1f"
  );
  document.documentElement.style.setProperty(
    "--toastify-color-light",
    "#ffffff"
  );
  document.documentElement.style.setProperty(
    "--toastify-toast-background",
    mode === "dark" ? "#1f1f1f" : "#ffffff"
  );
};


export const useAppTheme = () => useContext(ThemeContext);
