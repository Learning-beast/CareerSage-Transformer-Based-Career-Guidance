import mongoose from "mongoose";

const CareerSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    inputSnapshot: {
      type: Object,
      required: true
    },

    phaseResults: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("CareerSession", CareerSessionSchema);
