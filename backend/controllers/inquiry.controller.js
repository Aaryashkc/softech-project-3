import Inquiry from "../models/inquiry.model.js";

// Create an inquiry
export const createInquiry = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const {
    inquirerName,
    contactPerson,
    date,
    software,
    status,
    activities,
    comments,
  } = req.body;

  if (!inquirerName || !contactPerson || !date || !software || !status || !activities) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  try {
    const inquiry = await Inquiry.create({
      user: req.user._id,
      inquirerName,
      contactPerson,
      date,
      software,
      status,
      activities,
      comments,
    });

    res.status(201).json(inquiry);
  } catch (error) {
    console.error("Error creating inquiry:", error);
    res.status(500).json({ message: "Failed to create inquiry" });
  }
};

// Get inquiries by status or all for admin
export const getInquiries = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { status } = req.query; // optional query param ?status=in-talks

  try {
    const filter = {};

    if (status) filter.status = status;
    if (req.user.role !== "admin") filter.user = req.user._id;

    const inquiries = await Inquiry.find(filter).populate("user", "fullName email");

    res.status(200).json(inquiries);
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    res.status(500).json({ message: "Failed to fetch inquiries" });
  }
};

// Update inquiry
export const updateInquiry = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { id } = req.params;
  const {
    inquirerName,
    contactPerson,
    date,
    software,
    status,
    activities,
    comments,
  } = req.body;

  try {
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    if (
      req.user.role !== "admin" &&
      inquiry.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update fields if provided
    inquiry.inquirerName = inquirerName ?? inquiry.inquirerName;
    inquiry.contactPerson = contactPerson ?? inquiry.contactPerson;
    inquiry.date = date ?? inquiry.date;
    inquiry.software = software ?? inquiry.software;
    inquiry.status = status ?? inquiry.status;
    inquiry.activities = activities ?? inquiry.activities;
    inquiry.comments = comments ?? inquiry.comments;
    // Ensure user is preserved
    if (!inquiry.user) {
      inquiry.user = req.user._id;
    }

    await inquiry.save();

    res.status(200).json(inquiry);
  } catch (error) {
    console.error("Error updating inquiry:", error);
    res.status(500).json({ message: "Failed to update inquiry" });
  }
};

// Delete inquiry
export const deleteInquiry = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { id } = req.params;

  try {
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    if (
      req.user.role !== "admin" &&
      inquiry.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await inquiry.deleteOne();

    res.status(200).json({ message: "Inquiry entry deleted" });
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    res.status(500).json({ message: "Failed to delete inquiry" });
  }
};
