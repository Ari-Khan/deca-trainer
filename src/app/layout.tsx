import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/ThemeContext";
import { SupabaseProvider } from "@/lib/SupabaseContext";

const inter = Inter({ subsets: ["latin"], weight: ['200', '400', '500', '700'] });

export const metadata: Metadata = {
  title: "DECA Roleplay Trainer",
  description: "RHHS DECA competitive performance platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SupabaseProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}