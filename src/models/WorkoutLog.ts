import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWorkoutLog extends Document {
  userEmail: string; // 👈 Ye zaroori hai
  workoutName: string;
  date: Date;
  duration: number;
  exercises: any[];
}

const WorkoutLogSchema: Schema<IWorkoutLog> = new Schema(
  {
    userEmail: { type: String, required: true }, // 👈 User ka email
    workoutName: { type: String, required: true },
    date: { type: Date, default: Date.now },
    duration: { type: Number, required: true },
    exercises: { type: Array, required: true },
  },
  { timestamps: true }
);

const WorkoutLog: Model<IWorkoutLog> =
  mongoose.models.WorkoutLog || mongoose.model<IWorkoutLog>("WorkoutLog", WorkoutLogSchema);

export default WorkoutLog;