import { NextResponse } from "next/server";
import connectDB from "../../../src/lib/db"; 
import WorkoutLog from "../../../src/models/WorkoutLog";
import { getServerSession } from "next-auth"; // 👈 Session check karne ke liye
import { authOptions } from "../auth/[...nextauth]/route"; // 👈 Auth Config import path check kr lena

export async function POST(req: Request) {
  try {
    // 1. Pehle check karo user Login hai ya nahi
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized: Please Login first!" }, { status: 401 });
    }

    await connectDB();
    
    const body = await req.json();
    const { workoutName, duration, exercises } = body;

    console.log("📥 Saving Workout for:", session.user.email);

    // 2. Ab Email ke saath save karo
    const newLog = await WorkoutLog.create({
      userEmail: session.user.email, // 👈 YE LINE MISSING THI
      workoutName,
      duration,
      exercises,
    });

    console.log("✅ Saved to DB:", newLog._id);
    
    return NextResponse.json({ message: "Workout Saved!", id: newLog._id });

  } catch (error: any) {
    console.error("❌ Save Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}