import State from "../models/state.model.js";
import District from "../models/district.model.js";

export const createState = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Expected an array of states" });
    }

    const inserted = await State.insertMany(data);
    res.status(201).json({ message: "States inserted", inserted });
  } catch (error) {
    console.error("Bulk state insert error:", error);
    res.status(500).json({ message: "Failed to insert states" });
  }
};


export const createDistrict = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Expected an array of districts" });
    }

    const inserted = await District.insertMany(data);
    res.status(201).json({ message: "Districts inserted", inserted });
  } catch (error) {
    console.error("Bulk district insert error:", error);
    res.status(500).json({ message: "Failed to insert districts" });
  }
};


export const getStates = async (req, res) => {
  try {
    const states = await State.find().sort({ StateId: 1 });
    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch states" });
  }
};

export const getDistrictsByStateId = async (req, res) => {
  const { stateId } = req.params;
  try {
    const districts = await District.find({ StateId: parseInt(stateId) }).sort({ DistrictId: 1 });
    res.status(200).json(districts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch districts" });
  }
};

export const getAllDistricts = async (req, res) => {
  try {
    const districts = await District.find();
    res.status(200).json(districts);
  } catch (error) {
    console.error("Error fetching all districts:", error);
    res.status(500).json({ message: "Failed to fetch districts" });
  }
};

