import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black dark:bg-white text-white dark:text-black selection:bg-white dark:selection:bg-black selection:text-black dark:selection:text-white transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}