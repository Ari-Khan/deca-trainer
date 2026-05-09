import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-white text-zinc-900">
      <body className={`${inter.className} flex flex-col h-screen`}>
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-24">
          {children}
        </main>

        {/* The "Spotify" Persistent Audio Bar */}
        <footer className="fixed bottom-0 w-full h-20 bg-zinc-900 text-white border-t border-zinc-800 px-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-400 uppercase tracking-tighter">Now Playing</span>
            <span className="text-sm font-medium">DECA Roleplay - Business Law</span>
          </div>
          
          <div className="flex gap-4">
            {/* Audio controls will go here */}
            <div className="h-1 w-64 bg-zinc-700 rounded-full">
              <div className="h-1 w-1/3 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="text-xs text-zinc-400">01:45 / 05:00</div>
        </footer>
      </body>
    </html>
  );
}