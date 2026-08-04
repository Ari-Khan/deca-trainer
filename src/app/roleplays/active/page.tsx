"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Mode = "individual" | "team";
type Status = "idle" | "running" | "paused";

const DURATIONS: Record<Mode, number> = {
	individual: 10 * 60,
	team: 15 * 60,
};

const DEFAULT_MODE: Mode = "individual";

interface SessionData {
	url: string;
	mode: Mode;
	name: string;
}

function formatTime(totalSeconds: number) {
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function ActiveRoleplayPage() {
	const [session, setSession] = useState<SessionData | null>(null);
	const [remaining, setRemaining] = useState(0);
	const [status, setStatus] = useState<Status>("idle");

	useEffect(() => {
		const raw = sessionStorage.getItem("roleplay-pdf");
		if (!raw) return;

		try {
			const data = JSON.parse(raw) as SessionData;
			setSession(data);
			setRemaining(DURATIONS[data.mode] ?? DURATIONS[DEFAULT_MODE]);
		} catch {
			// ignore malformed session data
		}
	}, []);

	useEffect(() => {
		if (status !== "running") return;

		const interval = setInterval(() => {
			setRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					setStatus("paused");
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [status]);

	if (!session) {
		return (
			<div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col items-center justify-center gap-6 transition-colors duration-500">
				<p className="text-zinc-500 dark:text-zinc-400">No roleplay in progress.</p>
				<Link
					href="/dashboard/roleplays"
					className="px-10 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-bold transition-colors duration-300"
				>
					Back to Roleplays
				</Link>
			</div>
		);
	}

	const handleToggle = () => {
		setStatus((prev) => (prev === "running" ? "paused" : "running"));
	};

	const buttonLabel =
		status === "idle" ? "Start" : status === "running" ? "Pause" : "Resume";

	return (
		<div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col h-screen overflow-hidden transition-colors duration-500">
			<div className="h-16 shrink-0 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-8 transition-colors duration-500">
				<Link
					href="/dashboard/roleplays"
					className="flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-500 shrink-0"
				>
					<ChevronLeft className="w-4 h-4" />
					Back
				</Link>
				<span
					className={`text-2xl font-bold tabular-nums mx-auto ${
						remaining === 0
							? "text-red-500"
							: status !== "running"
								? "text-yellow-500"
								: ""
					}`}
				>
					{formatTime(remaining)}
				</span>
				<button
					onClick={handleToggle}
					className="min-w-[100px] px-8 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-bold transition-colors duration-300 shrink-0"
				>
					{buttonLabel}
				</button>
			</div>
			<div className="flex flex-1 overflow-hidden">
				<div className="flex-1 border-r border-zinc-200 dark:border-zinc-800 p-4 transition-colors duration-500">
					<iframe
						src={session.url}
						title={session.name}
						className="w-full h-full rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
					/>
				</div>
				<div className="flex-1 p-4 transition-colors duration-500">
					<textarea
						placeholder="Write your feedback..."
						className="w-full h-full resize-none rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors duration-500"
					/>
				</div>
			</div>
		</div>
	);
}
