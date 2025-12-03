import { NextResponse } from "next/server";
import connectDB from "../../../src/lib/db";
import WorkoutLog from "../../../src/models/WorkoutLog";
import { getServerSession } from "next-auth"; // 👈 Session import
import { authOptions } from "../auth/[...nextauth]/route"; // 👈 Auth Config import

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Pata karo kaun Login hai
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    console.log("Fetching history for:", session.user.email);

    // 2. Sirf ISSI User ka data nikalo (Filter by Email)
    const logs = await WorkoutLog.find({ userEmail: session.user.email }).sort({ createdAt: -1 });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("History Error:", error);
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
  }
}