import { NextResponse } from "next/server";
import connectDB from "../../../src/lib/db";
import User from "../../../src/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await connectDB();

    // 1. Check karo email pehle se hai kya
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered!" }, { status: 400 });
    }

    // 2. Password encrypt karo (Security ke liye)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. User save karo
    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "User registered successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}