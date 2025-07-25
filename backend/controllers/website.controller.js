import Website from "../models/website.model.js";

export const createWebsite = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const { software, startDate, endDate, state, district, palika } = req.body;

  if (!software || !startDate || !endDate || !state || !district || !palika) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const website = await Website.create({
      user: req.user._id,
      software,
      startDate,
      endDate,
      state,
      district,
      palika,
    });

    res.status(201).json(website);
  } catch (error) {
    console.error("Error creating website:", error);
    res.status(500).json({ message: "Failed to create website" });
  }
};

export const getWebsites = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    let websites;

    if (req.user.role === "admin") {
      websites = await Website.find().populate("user", "fullName email");
    } else {
      websites = await Website.find({ user: req.user._id });
    }

    res.status(200).json(websites);
  } catch (error) {
    console.error("Error fetching websites:", error);
    res.status(500).json({ message: "Failed to fetch websites" });
  }
};

export const updateWebsite = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const { id } = req.params;
  const { software, startDate, endDate, state, district, palika } = req.body;

  try {
    const website = await Website.findById(id);
    if (!website) return res.status(404).json({ message: "Website not found" });

    if (
      req.user.role !== "admin" &&
      website.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    website.software = software || website.software;
    website.startDate = startDate || website.startDate;
    website.endDate = endDate || website.endDate;
    website.state = state || website.state;
    website.district = district || website.district;
    website.palika = palika || website.palika;

    await website.save();
    res.status(200).json(website);
  } catch (error) {
    console.error("Error updating website:", error);
    res.status(500).json({ message: "Failed to update website" });
  }
};

export const deleteWebsite = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  const { id } = req.params;

  try {
    const website = await Website.findById(id);
    if (!website) return res.status(404).json({ message: "Not found" });
    if (
      req.user.role !== "admin" &&
      website.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await website.deleteOne();
    res.status(200).json({ message: "Website entry deleted" });
  } catch (error) {
    console.error("Error deleting website:", error);
    res.status(500).json({ message: "Failed to delete website" });
  }
};
