import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Variables ko try block ke bahar declare karte hain taaki catch block me use ho sakein
  let muscle = "Muscle"; 
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ Error: API Key nahi mili Vercel par");
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 👇 Tera model 'gemini-2.0-flash' hi rakha hai
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const body = await req.json();
    muscle = body.muscle || "Muscle"; // Fallback agar body empty ho
    const { equipment, level } = body;

    console.log(`🚀 Requesting AI for: ${muscle}`);

    const prompt = `Create a workout for ${level} level, ${muscle}, using ${equipment}. 
    Return STRICT JSON (No Markdown, No Intro). Format:
    {
      "workoutName": "Name",
      "exercises": [
        { "name": "Exercise Name", "sets": "3", "reps": "12", "tips": "Tip" }
      ]
    }`;

    // 👇 9 Second Timeout Logic
    const result = await Promise.race([
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 600 }, 
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout: AI took too long")), 9000))
    ]) as any;

    const response = await result.response;
    let text = response.text();

    // 👇 --- FIX: JSON SURGICAL CLEANING --- 👇
    // 1. Markdown hataya
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // 2. Sirf pehle '{' se aakhri '}' tak ka text nikala (Extra text gayab)
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");

    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    // 3. Parse kiya
    const plan = JSON.parse(text);
    
    console.log("✅ AI Success!");
    return NextResponse.json(plan);

  } catch (error: any) {
    console.error("❌ API ERROR:", error);

    // 👇 --- BACKUP PLAN (Agar AI fail ho ya JSON fat jaye) ---
    // User ko error dikhane se achha hai ek basic plan dikha do
    const backupPlan = {
      workoutName: `🔥 ${muscle} Power Workout (Backup)`,
      exercises: [
        { name: "Warm-up / Stretching", sets: "2", reps: "2 mins", tips: "Get blood flowing" },
        { name: "Primary Compound Movement", sets: "4", reps: "8-12", tips: "Focus on form and control" },
        { name: "Isolation Movement 1", sets: "3", reps: "12-15", tips: "Squeeze the muscle at the top" },
        { name: "Isolation Movement 2", sets: "3", reps: "15", tips: "Constant tension" },
        { name: "Finisher Burnout", sets: "3", reps: "Failure", tips: "Empty the tank!" }
      ]
    };

    return NextResponse.json(backupPlan);
  }
}