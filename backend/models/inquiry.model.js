import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema({
  inquirerName:{
    type: String,
    required: true
  },
  contactPerson: { 
    type: String, 
    required: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  software: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ["in-talks", "confirmed", "canceled"],
    default: "in-talks",
  },
  activities: [{ type: String }],
  comments: { type: String },
});

const inquiry = mongoose.model("Inquiry", InquirySchema);
export default inquiry;
