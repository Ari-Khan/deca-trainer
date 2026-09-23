import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { SupabaseProvider } from "@/context/SupabaseContext";

export const metadata: Metadata = {
	title: "DECA Roleplay Trainer",
	description: "RHHS DECA competitive performance platform.",
};

export default function HomeLayout({ children }: { children: ReactNode }) {
	return (
		<SupabaseProvider>
			<ThemeProvider>{children}</ThemeProvider>
		</SupabaseProvider>
	);
}
