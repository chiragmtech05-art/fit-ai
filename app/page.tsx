"use client";
import Link from "next/link";
// ThemeToggle ka import hata diya (ya comment kar diya)
// import ThemeToggle from "../src/components/ThemeToggle"; 
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();

  // Console me status check
  useEffect(() => {
    console.log("Current Login Status:", status);
  }, [status]);

  // Ziddi Logout Function
  const handleLogout = async () => {
    await signOut({ redirect: false });
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none hidden dark:block">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className="w-full p-6 flex justify-between items-center relative z-50">
        <div className="font-extrabold text-2xl tracking-tighter flex items-center gap-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-400">
            FitAI
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          
          {/* 👇 YAHAN SE BUTTON HATA DIYA HAI */}
          
          {status === "authenticated" && (
            <button 
              onClick={handleLogout}
              className="text-sm font-bold text-red-500 hover:text-red-400 bg-red-500/10 px-4 py-2 rounded-lg transition-all border border-red-500/20 cursor-pointer z-50"
            >
              Logout 🚪
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 z-10 -mt-20 relative">
        
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-700/50 shadow-sm">
          ✨ AI-Powered Fitness Revolution
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight max-w-4xl leading-tight text-gray-900 dark:text-white">
          Your dream physique, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 dark:from-purple-400 dark:via-blue-400 dark:to-purple-400 animate-gradient">
            engineered by AI.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10 leading-relaxed">
          Stop guessing. Get personalized workout plans, track your progress, and smash your limits with the smartest fitness coach.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md relative z-50">
          
          {status === "loading" ? (
            <div className="w-full py-4 text-gray-500 font-bold animate-pulse text-center">Checking...</div>
          ) : status === "authenticated" ? (
            // LOGGED IN VIEW
            <>
              <Link href="/generate" className="flex-1 cursor-pointer">
                <button className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer">
                  Generate Workout ⚡
                </button>
              </Link>
              <Link href="/dashboard" className="flex-1 cursor-pointer">
                <button className="w-full py-4 px-8 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white font-bold rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-50 transition-all active:scale-95 backdrop-blur-md cursor-pointer">
                  Dashboard 📊
                </button>
              </Link>
            </>
          ) : (
            // GUEST VIEW
            <>
              <Link href="/register" className="flex-1 cursor-pointer">
                <button className="w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer">
                  Get Started 🚀
                </button>
              </Link>
              <Link href="/login" className="flex-1 cursor-pointer">
                <button className="w-full py-4 px-8 bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white font-bold rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:bg-gray-50 transition-all active:scale-95 backdrop-blur-md cursor-pointer">
                  Login 🔐
                </button>
              </Link>
            </>
          )}

        </div>

      </main>
    </div>
  );
}