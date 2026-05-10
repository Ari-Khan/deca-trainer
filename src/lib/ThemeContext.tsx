"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<Theme>("light");

	// On mount, read saved preference or system preference
	useEffect(() => {
		const saved = localStorage.getItem("theme") as Theme | null;
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)"
		).matches;
		const resolved = saved ?? (prefersDark ? "dark" : "light");
		setTheme(resolved);
		document.documentElement.classList.toggle("dark", resolved === "dark");
	}, []);

	const toggleTheme = () => {
		setTheme((prev) => {
			const next = prev === "light" ? "dark" : "light";
			localStorage.setItem("theme", next);
			document.documentElement.classList.toggle("dark", next === "dark");
			return next;
		});
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
	return ctx;
}
