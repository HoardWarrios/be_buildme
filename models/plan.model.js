import mongoose from "mongoose";
const { Schema } = mongoose;

const PlanSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: false,
    },
    address: {
      type: String,
      required: true,
    },
    requestTime: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      required: false,
    },
    gigId: {
      type: String,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Plan", PlanSchema);