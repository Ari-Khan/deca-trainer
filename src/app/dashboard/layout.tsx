import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/lib/ThemeContext";
import { SupabaseProvider } from "@/lib/SupabaseContext";

export default function DashboardLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<SupabaseProvider>
			<ThemeProvider>
				<div className="flex h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black transition-colors duration-500">
					<Sidebar />
					<main className="flex-1 overflow-y-auto">{children}</main>
				</div>
			</ThemeProvider>
		</SupabaseProvider>
	);
}
