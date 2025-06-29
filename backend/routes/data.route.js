import express from "express";
import {
  createState,
  createDistrict,
  getStates,
  getDistrictsByStateId,
  getAllDistricts,
} from "../controllers/data.controller.js";

const router = express.Router();

router.post("/state", createState);
router.post("/district", createDistrict); 

router.get("/states", getStates); 
router.get("/districts/:stateId", getDistrictsByStateId); 
router.get("/districts", getAllDistricts); 

export default router;
