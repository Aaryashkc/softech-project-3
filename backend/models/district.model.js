import mongoose from "mongoose";

const districtSchema = mongoose.Schema({
  DistrictId: { 
    type: Number, 
    required: true, 
    unique: true },
  DistrictName: { 
    type: String, required: true },
  DistrictNameNep: { 
    type: String, required: true },
  StateId: { 
    type: Number, required: true }, 
  DistrictCode: { 
    type: String, default: null }
});

const District = mongoose.model("District", districtSchema);
export default District;
