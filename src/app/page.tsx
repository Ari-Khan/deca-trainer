"use client";

import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/SupabaseContext";
import { useState, useEffect } from "react";

export default function LandingPage() {
	const router = useRouter();
	const supabase = useSupabase();
	const [isChecking, setIsChecking] = useState(true);
	const [isSigningIn, setIsSigningIn] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// onAuthStateChange fires reliably after OAuth redirect,
		// replacing the one-shot getSession() that raced against token processing.
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			if (session?.user) {
				router.replace("/dashboard");
			} else {
				// INITIAL_SESSION with no user = definitely logged out
				if (event === "INITIAL_SESSION") {
					setIsChecking(false);
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [supabase, router]);

	const handleGoogleSignIn = async () => {
		setIsSigningIn(true);
		setError(null);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					// This route exchanges the code for a session server-side,
					// then redirects to /dashboard cleanly.
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});
			if (error) throw error;
		} catch (err) {
			console.error("Sign-in error:", err);
			setError("Sign-in failed. Please try again.");
			setIsSigningIn(false);
		}
	};

	return (
		<>
			{isChecking ? (
				<div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
					<p className="text-zinc-500">Loading...</p>
				</div>
			) : (
				<div className="min-h-screen bg-white text-black dark:bg-black dark:text-white font-sans antialiased selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black flex flex-col transition-colors duration-300">
					<header className="border-b border-zinc-100/50 dark:border-zinc-900/50 py-4 px-6 transition-colors duration-300">
						<div className="max-w-7xl mx-auto flex items-center justify-between">
							<span className="text-sm font-medium tracking-tight uppercase text-zinc-400 dark:text-zinc-600">
								DECA Trainer{" "}
								<span className="text-black dark:text-white">
									/ V1
								</span>
							</span>
						</div>
					</header>

					<main className="grow flex items-center justify-center">
						<div className="max-w-2xl text-center px-6 space-y-16">
							<div className="space-y-4">
								<h1 className="text-6xl font-extralight tracking-tighter leading-tight">
									A smarter way to{" "}
									<span className="font-medium">train.</span>
								</h1>
								<p className="text-zinc-500 dark:text-zinc-400 text-lg font-light max-w-md mx-auto transition-colors duration-300">
									An exam and roleplay companion for RHHS
									DECA. Record, review, and refine your
									competitive performance.
								</p>
							</div>

							<div className="flex flex-col items-center gap-4">
								{error && (
									<p className="text-red-500 text-sm">
										{error}
									</p>
								)}
								<button
									onClick={handleGoogleSignIn}
									disabled={isSigningIn}
									className="px-10 py-3.5 bg-black dark:bg-white text-white dark:text-black text-sm font-medium rounded-full tracking-tight hover:bg-zinc-700 dark:hover:bg-zinc-100 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
								>
									{isSigningIn ? (
										<svg
											className="w-5 h-5 animate-spin"
											viewBox="0 0 24 24"
											fill="none"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											/>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8v8H4z"
											/>
										</svg>
									) : (
										<svg
											className="w-5 h-5"
											viewBox="0 0 24 24"
										>
											<path
												fill="currentColor"
												d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											/>
											<path
												fill="currentColor"
												d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											/>
											<path
												fill="currentColor"
												d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											/>
											<path
												fill="currentColor"
												d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											/>
										</svg>
									)}
									{isSigningIn
										? "Signing in..."
										: "Login With Google"}
								</button>
							</div>
						</div>
					</main>

					<footer className="py-6 px-6 border-t border-zinc-50 dark:border-zinc-950 transition-colors duration-300">
						<div className="max-w-7xl mx-auto text-center">
							<p className="text-[10px] text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.3em] transition-colors duration-300">
								Developed by Ari Khan
							</p>
						</div>
					</footer>
				</div>
			)}
		</>
	);
}
