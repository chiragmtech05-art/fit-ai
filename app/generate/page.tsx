"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GeneratePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    muscle: "",
    equipment: "",
    level: "",
  });

  const handleGenerate = async () => {
    if (!formData.muscle || !formData.equipment || !formData.level) {
      alert("Please select all options!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // Agar server ne error diya (Timeout ya Key issue)
        throw new Error(data.details || "Failed to generate");
      }

      localStorage.setItem("generatedPlan", JSON.stringify(data));
      router.push("/workout");

    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };
  // --- CLEAN PROFESSIONAL CARD ---
  const SelectionCard = ({ label, value, category }: any) => {
    const isSelected = formData[category as keyof typeof formData] === value;
    
    return (
      <button
        onClick={() => setFormData({ ...formData, [category]: value })}
        className={`relative group w-full py-4 px-2 rounded-xl border font-bold text-sm sm:text-base transition-all duration-200 ease-out
          ${isSelected 
            ? "border-purple-500 bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-[1.02]" 
            : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-purple-400 dark:hover:border-purple-600 hover:text-purple-500 dark:hover:text-purple-400"
          }
        `}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 py-12 px-4 sm:px-6 flex items-center justify-center">
      
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none hidden dark:block">
        <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[80px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Build Your Routine
          </h1>
          <p className="text-gray-500 dark:text-gray-500 font-medium">
            Select your preferences below
          </p>
        </div>

        {/* Form Container */}
        <div className="space-y-10">
          
          {/* Muscle Group */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">
              01. Target Muscle
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <SelectionCard label="Chest" value="chest" category="muscle" />
              <SelectionCard label="Back" value="back" category="muscle" />
              <SelectionCard label="Legs" value="legs" category="muscle" />
              <SelectionCard label="Arms" value="arms" category="muscle" />
              <SelectionCard label="Abs" value="abs" category="muscle" />
              <SelectionCard label="Full Body" value="full_body" category="muscle" />
            </div>
          </div>

          {/* Equipment */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">
              02. Equipment
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <SelectionCard label="Full Gym" value="gym" category="equipment" />
              <SelectionCard label="Dumbbells" value="dumbbells" category="equipment" />
              <SelectionCard label="Bodyweight" value="bodyweight" category="equipment" />
              <SelectionCard label="Home Kit" value="home" category="equipment" />
            </div>
          </div>

          {/* Level */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-1">
              03. Intensity
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <SelectionCard label="Beginner" value="beginner" category="level" />
              <SelectionCard label="Intermediate" value="intermediate" category="level" />
              <SelectionCard label="Advanced" value="advanced" category="level" />
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-8">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-5 rounded-xl font-bold text-lg tracking-wide shadow-xl transition-all duration-300 transform active:scale-[0.98]
                ${loading 
                  ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-200 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-white/10"
                }
              `}
            >
              {loading ? "Generating Plan..." : "GENERATE WORKOUT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}