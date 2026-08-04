"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Mode = "individual" | "team";

export default function RoleplaysPage() {
	const router = useRouter();
	const individualInputRef = useRef<HTMLInputElement>(null);
	const teamInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelected =
		(mode: Mode) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			const url = URL.createObjectURL(file);
			sessionStorage.setItem(
				"roleplay-pdf",
				JSON.stringify({ url, mode, name: file.name })
			);
			router.push("/roleplays/active");
		};

	return (
		<div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-12 pt-32 pb-8 transition-colors duration-500">
			<div className="max-w-5xl mx-0">
				<Link
					href="/dashboard"
					className="inline-flex items-center gap-1 text-sm text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-500 mb-6"
				>
					<ChevronLeft className="w-4 h-4" />
					Back
				</Link>
				<h1 className="text-3xl font-thin tracking-tight">Roleplays</h1>
				<div className="flex flex-col items-start">
					<div className="flex gap-4">
						<button
							onClick={() => individualInputRef.current?.click()}
							className="px-10 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-bold transition-colors duration-300 mt-5 mb-5"
						>
							Start Individual Roleplay
						</button>
						<button
							onClick={() => teamInputRef.current?.click()}
							className="px-10 py-3 rounded-full border border-black text-black dark:border-white dark:text-white text-sm font-bold transition-colors duration-300 mt-5 mb-5"
						>
							Start Team Roleplay
						</button>
						<input
							ref={individualInputRef}
							type="file"
							accept="application/pdf"
							className="hidden"
							onChange={handleFileSelected("individual")}
						/>
						<input
							ref={teamInputRef}
							type="file"
							accept="application/pdf"
							className="hidden"
							onChange={handleFileSelected("team")}
						/>
					</div>
				</div>
				<div className="mt-2 space-y-6">
					<div className="space-y-6">
						<section>
							<h2 className="text-2xl font-thin border-b border-black dark:border-white pb-1">
								BUSINESS ADMINISTRATION CORE
							</h2>
						</section>
						<section>
							<h2 className="text-2xl font-thin border-b border-black dark:border-white pb-1">
								BUSINESS MANAGEMENT + ADMINISTRATION
							</h2>
						</section>
						<section>
							<h2 className="text-2xl font-thin border-b border-black dark:border-white pb-1">
								ENTREPRENEURSHIP
							</h2>
						</section>
						<section>
							<h2 className="text-2xl font-thin border-b border-black dark:border-white pb-1">
								FINANCE
							</h2>
						</section>
						<section>
							<h2 className="text-2xl font-thin border-b border-black dark:border-white pb-1">
								HOSPITALITY + TOURISM
							</h2>
						</section>
						<section>
							<h2 className="text-2xl font-thin border-b border-black dark:border-white pb-1">
								MARKETING
							</h2>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}
