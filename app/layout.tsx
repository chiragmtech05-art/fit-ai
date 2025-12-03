import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "../src/components/ThemeProvider";
import AuthProvider from "../src/components/AuthProvider"; // 👈 New Import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitAI Coach",
  description: "AI powered workout generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 dark:bg-black dark:text-white transition-colors duration-300`}>
        {/* 👇 AuthProvider sabse bahar lagana hai */}
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}