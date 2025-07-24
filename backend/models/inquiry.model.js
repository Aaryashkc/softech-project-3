import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema({
  inquirerName: {
    type: String,
    required: true,
    trim: true
  },
  contactPerson: { 
    type: String, 
    required: true,
    trim: true
  },
  contactPersonEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  software: { 
    type: String, 
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ["in-talks", "confirmed", "canceled"],
    default: "in-talks"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  activities: [{ 
    type: String,
    trim: true
  }],
  comments: { 
    type: String,
    trim: true
  }
});

const inquiry = mongoose.model("Inquiry", InquirySchema);
export default inquiry;
