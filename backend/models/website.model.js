import mongoose from "mongoose";

const websiteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    software: { 
      type: String, 
      required: true 
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    state: {
      type: Number,  
      required: true,
    },
    district: {
      type: Number, 
      required: true,
    },
  },
  { timestamps: true }
);

const website = mongoose.model("website", websiteSchema);
export default website;
