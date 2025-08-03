import Inquiry from "../models/inquiry.model.js";
import Website from "../models/website.model.js";
import State from "../models/state.model.js";
import District from "../models/district.model.js";
import Palika from "../models/palika.model.js";

// 1. Inquiry Summary (Total, With Actions, Confirmed, Canceled)
export const getInquirySummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const [total, withActions, confirmed, canceled] = await Promise.all([
      Inquiry.countDocuments({ user: userId }),
      Inquiry.countDocuments({ user: userId, actions: { $exists: true, $not: { $size: 0 } } }),
      Inquiry.countDocuments({ user: userId, status: "confirmed" }),
      Inquiry.countDocuments({ user: userId, status: "canceled" }),
    ]);

    res.json({
      totalInquiries: total,
      inquiriesWithActions: withActions,
      confirmed,
      canceled,
    });
  } catch (error) {
    console.error("Inquiry Summary Error:", error);
    res.status(500).json({ message: "Failed to fetch inquiry summary" });
  }
};

// 2. Inquiries by Status (Pie/Bar)
export const getInquiriesByStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Inquiry.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(result);
  } catch (error) {
    console.error("Inquiries by Status Error:", error);
    res.status(500).json({ message: "Failed to fetch inquiries by status" });
  }
};

// 3. Monthly Inquiries (Line/Bar)
export const getMonthlyInquiries = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Inquiry.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$date" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          month: "$_id",
          count: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } }
    ]);

    res.json(result);
  } catch (error) {
    console.error("Monthly Inquiries Error:", error);
    res.status(500).json({ message: "Failed to fetch monthly inquiries" });
  }
};

// 4. Action Stats by Type (Pie/Bar)
export const getActionStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Inquiry.aggregate([
      { $match: { user: userId } },
      { $unwind: "$actions" },
      {
        $group: {
          _id: "$actions.type",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          type: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    res.json(result);
  } catch (error) {
    console.error("Action Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch action statistics" });
  }
};

// 5. Conversion Funnel (Simple bar/funnel)
export const getConversionFunnel = async (req, res) => {
  try {
    const userId = req.user._id;

    const [total, withActions, confirmed, canceled] = await Promise.all([
      Inquiry.countDocuments({ user: userId }),
      Inquiry.countDocuments({ user: userId, actions: { $exists: true, $not: { $size: 0 } } }),
      Inquiry.countDocuments({ user: userId, status: "confirmed" }),
      Inquiry.countDocuments({ user: userId, status: "canceled" }),
    ]);

    res.json([
      { label: "Total Inquiries", value: total },
      { label: "With Actions", value: withActions },
      { label: "Confirmed", value: confirmed },
      { label: "Canceled", value: canceled },
    ]);
  } catch (error) {
    console.error("Conversion Funnel Error:", error);
    res.status(500).json({ message: "Failed to fetch conversion funnel data" });
  }
};

export const getWebsitesByLocation = async (req, res) => {
  try {
    const userId = req.user._id;

    const states = await Website.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$state", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "states",
          localField: "_id",
          foreignField: "StateId",
          as: "stateInfo"
        }
      },
      { $unwind: "$stateInfo" },
      {
        $project: {
          name: "$stateInfo.StateName",
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    const districts = await Website.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$district", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "districts",
          localField: "_id",
          foreignField: "DistrictId",
          as: "districtInfo"
        }
      },
      { $unwind: "$districtInfo" },
      {
        $project: {
          name: "$districtInfo.DistrictName",
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    const palikas = await Website.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$palika", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "palikas",
          localField: "_id",
          foreignField: "PalikaId",
          as: "palikaInfo"
        }
      },
      { $unwind: "$palikaInfo" },
      {
        $project: {
          name: "$palikaInfo.PalikaName",
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ states, districts, palikas });
  } catch (error) {
    console.error("Websites by Location Error:", error);
    res.status(500).json({ message: "Failed to fetch location stats" });
  }
};
