"use client";

import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/SupabaseContext";
import { useEffect, useState } from "react";
import ActionCard from "@/components/ActionCard";

export default function DashboardPage() {
	const router = useRouter();
	const supabase = useSupabase();
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (session?.user) {
				setIsReady(true);
			} else if (event === "INITIAL_SESSION" || event === "SIGNED_OUT") {
				// Definitively no session — send home
				router.replace("/");
			}
		});

		return () => subscription.unsubscribe();
	}, [supabase, router]);

	if (!isReady) {
		return (
			<div className="flex-1 flex items-center justify-center min-h-screen">
				<p className="text-zinc-500 dark:text-zinc-400">Loading...</p>
			</div>
		);
	}

	return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-white dark:bg-black pb-8 px-8 min-h-screen transition-colors duration-500">
			{/* Visual Header for the Menu */}
			<div className="mb-8 text-center space-y-2">
				<h2 className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-[0.5em] transition-colors duration-500">
					Portal
				</h2>
                <div className="h-px w-12 bg-zinc-300 dark:bg-zinc-700 mx-auto transition-colors duration-500" />
			</div>

			{/* The Two Main Module Buttons */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
				<ActionCard
					number="01"
					title="Exams"
					description="Access official timed exams from various competitive events."
					href="/dashboard/exams"
				/>
				<ActionCard
					number="02"
					title="Roleplays"
					description="Interactive simulations for Individual Series events and Team Decision Making, with and without a trainer."
					href="/dashboard/roleplays"
				/>
			</div>
		</div>
	);
}
