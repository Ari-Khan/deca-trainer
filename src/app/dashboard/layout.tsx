import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black transition-colors duration-300">
			<Sidebar />
			<main className="flex-1 overflow-y-auto">{children}</main>
		</div>
	);
}
