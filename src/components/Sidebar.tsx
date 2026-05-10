"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { useSupabase } from "@/lib/SupabaseContext";

export default function Sidebar() {
	const { theme, toggleTheme } = useTheme();
	const supabase = useSupabase();
	const [profileImage, setProfileImage] = useState<string | null>(null);
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getUser = async () => {
			try {
				setIsLoading(true);

				const {
					data: { user },
					error,
				} = await supabase.auth.getUser();

				if (error) {
					console.error("Error fetching user:", error);
					return;
				}

				if (user) {
					setUserEmail(user.email || null);
					setProfileImage(user.user_metadata?.picture ?? null);
				}
			} catch (error) {
				console.error("Error in getUser:", error);
			} finally {
				setIsLoading(false);
			}
		};

		getUser();
	}, [supabase]);

	const links = [
		{ name: "Home", href: "/dashboard" },
		{ name: "Exams", href: "/dashboard/exams" },
		{ name: "Roleplays", href: "/dashboard/roleplays" },
		{ name: "Performance", href: "/dashboard/stats" },
		{ name: "Resources", href: "/dashboard/docs" },
	];

	return (
		<aside className="w-64 border-r border-zinc-100 dark:border-zinc-900 flex flex-col justify-between p-10 bg-white dark:bg-black text-black dark:text-white transition-colors duration-500">
			<div>
				<div className="font-bold tracking-tighter text-lg mb-20">
					DECA<span className="font-light opacity-50">TRAINER</span> V1
				</div>

				<nav className="space-y-6">
					{links.map((link) => (
						<a
							key={link.name}
							href={link.href}
							className="block text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-500"
						>
							{link.name}
						</a>
					))}
				</nav>
			</div>

			<div className="space-y-6">
				<button
					onClick={toggleTheme}
					className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors duration-500 text-sm font-medium text-black dark:text-white"
				>
					{theme === "light" ? (
						<>
							<Moon className="w-4 h-4" />
							Dark Theme
						</>
					) : (
						<>
							<Sun className="w-4 h-4" />
							Light Theme
						</>
					)}
				</button>

				<div className="flex items-center gap-3 group cursor-pointer">
					{isLoading ? (
						<div className="w-6 h-6 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-pulse transition-colors duration-500" />
					) : profileImage ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={profileImage}
							alt="Profile"
							className="w-8 h-8 rounded-full object-cover shrink-0"
							crossOrigin="anonymous"
							onError={() => setProfileImage(null)}
						/>
					) : (
						<div className="w-8 h-8 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center text-sm font-medium shrink-0 text-black dark:text-white">
							{userEmail?.[0]?.toUpperCase() || "U"}
						</div>
					)}
					<span className="text-xs uppercase tracking-widest text-zinc-600 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors duration-500">
						Account
					</span>
				</div>
			</div>
		</aside>
	);
}