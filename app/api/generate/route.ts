import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Vercel ko bolte hain ye dynamic route hai
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ Error: API Key nahi mili Vercel par");
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 👇 YAHAN HAI FIX: Hum '2.0-flash' use karenge jo teri list me tha
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const body = await req.json();
    const { muscle, equipment, level } = body;

    console.log(`🚀 Requesting AI for: ${muscle}`);

    const prompt = `Create a workout for ${level} level, ${muscle}, using ${equipment}. 
    Return STRICT JSON (No Markdown). Format:
    {
      "workoutName": "Name",
      "exercises": [
        { "name": "Exercise Name", "sets": "3", "reps": "12", "tips": "Tip" }
      ]
    }`;

    // 👇 9 Second ka timeout (Vercel ke 10s limit se pehle hum khud error pakad lenge)
    const result = await Promise.race([
      model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 500 }, // Chota response taaki fast ho
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout: AI took too long")), 9000))
    ]) as any;

    const response = await result.response;
    let text = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    
    console.log("✅ AI Success!");
    return NextResponse.json(JSON.parse(text));

  } catch (error: any) {
    // Ye error Vercel ke 'Logs' tab me dikhega
    console.error("❌ API ERROR:", error);
    return NextResponse.json({ error: "Generation Failed", details: error.message }, { status: 500 });
  }
}