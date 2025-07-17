import express from "express";
import {
  createState,
  createDistrict,
  getStates,
  getDistrictsByStateId,
  getAllDistricts,
  createPalika,
  getPalikasByDistrictId,
  getAllPalikas,
} from "../controllers/data.controller.js";

const router = express.Router();

router.post("/state", createState);
router.post("/district", createDistrict); 
router.post("/palika", createPalika)

router.get("/states", getStates); 

router.get("/districts/:stateId", getDistrictsByStateId); 
router.get("/districts", getAllDistricts); 

router.get("/palikas/:DistrictId", getPalikasByDistrictId);
router.get("/palikas", getAllPalikas)


export default router;
