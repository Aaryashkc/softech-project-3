import mongoose from "mongoose";

const PalikaSchema = mongoose.Schema({
  PalikaId: { 
    type: Number, 
    required: true, 
    unique: true },
  DistrictId: { 
    type: Number, required: true }, 
  PalikaName: { 
    type: String, required: true },
  PalikaNameNep: { 
    type: String, required: true },
  PalikaCode: { 
    type: String, default: null }
});

const Palika = mongoose.model("Palika", PalikaSchema);
export default Palika;
