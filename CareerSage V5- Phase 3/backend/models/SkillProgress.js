import mongoose from "mongoose";

const SkillProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    skill: {
      type: String,
      required: true
    },

    level: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },

    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
);

export default mongoose.model("SkillProgress", SkillProgressSchema);
