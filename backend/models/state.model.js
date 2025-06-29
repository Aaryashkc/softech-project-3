import mongoose from "mongoose";

const stateSchema = mongoose.Schema({
  StateId: { 
    type: Number, 
    required: true, 
    unique: true },
  StateName: { 
    type: String, 
    required: true },
  StateNameNep: { 
    type: String, 
    required: true },
  StateCode: { 
    type: String, 
    default: null }
});

const State = mongoose.model("State", stateSchema);
export default State;
