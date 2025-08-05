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
      default: Date.now,
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
    palika: {
      type: Number, 
      required: true,
    },
    sector: {
  type: String,
  enum: [
    "local-municipality",
    "hospital",
    "school",
    "college",
    "university",
    "ngo",
    "government",
    "corporate",
    "ecommerce",
    "restaurant",
    "hotel",
    "travel-agency",
    "it-company",
    "finance-bank",
    "real-estate",
    "personal-portfolio",
    "media-news",
    "manufacturing",
    "construction",
    "healthcare-clinic",
    "law-firm",
    "education-center",
    "automobile",
    "retail-store",
    "logistics"
  ],
  default: "local-municipality"
}
  },
  { timestamps: true }
);

const website = mongoose.model("website", websiteSchema);
export default website;
