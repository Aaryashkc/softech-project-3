import Inquiry from "../models/inquiry.model.js";
import Website from "../models/website.model.js";


export const getInquirySummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Date calculations
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Fix January edge case for previous month calculation
    const previousMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const previousYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    const previousMonthStart = new Date(previousYear, previousMonth, 1);
    const previousMonthEnd = new Date(previousYear, previousMonth + 1, 0);

    // Overall totals (all time)
    const [totalInquiries, inquiriesWithActions, confirmed, canceled, inTalks] = await Promise.all([
      Inquiry.countDocuments({ user: userId }),
      Inquiry.countDocuments({ user: userId, actions: { $exists: true, $not: { $size: 0 } } }),
      Inquiry.countDocuments({ user: userId, status: "confirmed" }),
      Inquiry.countDocuments({ user: userId, status: "canceled" }),
      Inquiry.countDocuments({ user: userId, status: "in-talks" }),
    ]);

    // Current month data
    const [currentTotal, currentWithActions, currentConfirmed, currentCanceled] = await Promise.all([
      Inquiry.countDocuments({ 
        user: userId,
        date: { $gte: currentMonthStart, $lte: currentMonthEnd }
      }),
      Inquiry.countDocuments({ 
        user: userId,
        date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        actions: { $exists: true, $not: { $size: 0 } }
      }),
      Inquiry.countDocuments({ 
        user: userId,
        date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        status: "confirmed"
      }),
      Inquiry.countDocuments({ 
        user: userId,
        date: { $gte: currentMonthStart, $lte: currentMonthEnd },
        status: "canceled"
      }),
    ]);

    // Previous month data
    const [previousTotal, previousWithActions, previousConfirmed, previousCanceled] = await Promise.all([
      Inquiry.countDocuments({ 
        user: userId,
        date: { $gte: previousMonthStart, $lte: previousMonthEnd }
      }),
      Inquiry.countDocuments({ 
        user: userId,
        date: { $gte: previousMonthStart, $lte: previousMonthEnd },
        actions: { $exists: true, $not: { $size: 0 } }
      }),
      Inquiry.countDocuments({ 
        user: userId,
        date: { $gte: previousMonthStart, $lte: previousMonthEnd },
        status: "confirmed"
      }),
      Inquiry.countDocuments({ 
        user: userId,
        date: { $gte: previousMonthStart, $lte: previousMonthEnd },
        status: "canceled"
      }),
    ]);

    // Calculate percentage changes
    const calculateChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Get conversion rate
    const conversionRate = totalInquiries > 0 ? Math.round((confirmed / totalInquiries) * 100) : 0;

    res.json({
      totalInquiries,
      inquiriesWithActions,
      confirmed,
      canceled,
      inTalks,
      conversionRate,
      changes: {
        totalInquiries: calculateChange(currentTotal, previousTotal),
        inquiriesWithActions: calculateChange(currentWithActions, previousWithActions),
        confirmed: calculateChange(currentConfirmed, previousConfirmed),
        canceled: calculateChange(currentCanceled, previousCanceled),
      },
      currentMonth: {
        total: currentTotal,
        withActions: currentWithActions,
        confirmed: currentConfirmed,
        canceled: currentCanceled,
      },
      previousMonth: {
        total: previousTotal,
        withActions: previousWithActions,
        confirmed: previousConfirmed,
        canceled: previousCanceled,
      }
    });
  } catch (error) {
    console.error("Inquiry Summary Error:", error);
    res.status(500).json({ message: "Failed to fetch inquiry summary" });
  }
};

// 2. Inquiries by Status with percentages
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

    // Calculate total for percentages
    const total = result.reduce((sum, item) => sum + item.count, 0);
    
    // Add percentages and format status names
    const enhancedResult = result.map(item => ({
      ...item,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
      label: item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')
    }));

    res.json(enhancedResult);
  } catch (error) {
    console.error("Inquiries by Status Error:", error);
    res.status(500).json({ message: "Failed to fetch inquiries by status" });
  }
};

// 3. Enhanced Monthly Inquiries with growth rate
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
          count: { $sum: 1 },
          confirmed: {
            $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] }
          },
          canceled: {
            $sum: { $cond: [{ $eq: ["$status", "canceled"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          month: "$_id",
          count: 1,
          confirmed: 1,
          canceled: 1,
          _id: 0
        }
      },
      { $sort: { month: 1 } }
    ]);

    // Calculate growth rate for each month
    const enhancedResult = result.map((item, index) => {
      if (index === 0) {
        return { ...item, growthRate: 0 };
      }
      
      const previousCount = result[index - 1].count;
      const growthRate = previousCount === 0 ? 
        (item.count > 0 ? 100 : 0) : 
        Math.round(((item.count - previousCount) / previousCount) * 100);
      
      return { ...item, growthRate };
    });

    res.json(enhancedResult);
  } catch (error) {
    console.error("Monthly Inquiries Error:", error);
    res.status(500).json({ message: "Failed to fetch monthly inquiries" });
  }
};

// 4. Action Stats by Type with enhanced data
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
          label: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", "meeting"] }, then: "Meetings" },
                { case: { $eq: ["$_id", "demo"] }, then: "Demos" },
                { case: { $eq: ["$_id", "call"] }, then: "Calls" },
                { case: { $eq: ["$_id", "follow-up"] }, then: "Follow-ups" },
                { case: { $eq: ["$_id", "note"] }, then: "Notes" },
                { case: { $eq: ["$_id", "other"] }, then: "Other" }
              ],
              default: "Unknown"
            }
          },
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(result);
  } catch (error) {
    console.error("Action Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch action statistics" });
  }
};

// 5. Enhanced Conversion Funnel
export const getConversionFunnel = async (req, res) => {
  try {
    const userId = req.user._id;

    const [total, withActions, confirmed, canceled] = await Promise.all([
      Inquiry.countDocuments({ user: userId }),
      Inquiry.countDocuments({ user: userId, actions: { $exists: true, $not: { $size: 0 } } }),
      Inquiry.countDocuments({ user: userId, status: "confirmed" }),
      Inquiry.countDocuments({ user: userId, status: "canceled" }),
    ]);

    // Calculate conversion rates
    const actionRate = total > 0 ? Math.round((withActions / total) * 100) : 0;
    const confirmationRate = total > 0 ? Math.round((confirmed / total) * 100) : 0;
    const cancellationRate = total > 0 ? Math.round((canceled / total) * 100) : 0;

    res.json([
      { 
        label: "Total Inquiries", 
        value: total, 
        percentage: 100,
        color: "#1e40af"
      },
      { 
        label: "With Actions", 
        value: withActions, 
        percentage: actionRate,
        color: "#3b82f6"
      },
      { 
        label: "Confirmed", 
        value: confirmed, 
        percentage: confirmationRate,
        color: "#10b981"
      },
      { 
        label: "Canceled", 
        value: canceled, 
        percentage: cancellationRate,
        color: "#ef4444"
      },
    ]);
  } catch (error) {
    console.error("Conversion Funnel Error:", error);
    res.status(500).json({ message: "Failed to fetch conversion funnel data" });
  }
};

// 6. Enhanced Websites by Location
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
          stateId: "$_id",
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
          districtId: "$_id",
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
          palikaId: "$_id",
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get software distribution
    const softwareStats = await Website.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$software", count: { $sum: 1 } } },
      {
        $project: {
          software: "$_id",
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get active vs expired websites
    const now = new Date();
    const [activeWebsites, expiredWebsites] = await Promise.all([
      Website.countDocuments({ user: userId, endDate: { $gte: now } }),
      Website.countDocuments({ user: userId, endDate: { $lt: now } })
    ]);

    res.json({ 
      states, 
      districts, 
      palikas,
      softwareStats,
      websiteStatus: {
        active: activeWebsites,
        expired: expiredWebsites,
        total: activeWebsites + expiredWebsites
      }
    });
  } catch (error) {
    console.error("Websites by Location Error:", error);
    res.status(500).json({ message: "Failed to fetch location stats" });
  }
};

// 7. New: Software Distribution
export const getSoftwareStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Inquiry software distribution
    const inquirySoftware = await Inquiry.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$software", count: { $sum: 1 } } },
      {
        $project: {
          software: "$_id",
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Website software distribution
    const websiteSoftware = await Website.aggregate([
      { $match: { user: userId } },
      { $group: { _id: "$software", count: { $sum: 1 } } },
      {
        $project: {
          software: "$_id",
          count: 1,
          _id: 0
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      inquiries: inquirySoftware,
      websites: websiteSoftware
    });
  } catch (error) {
    console.error("Software Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch software statistics" });
  }
};

// 8. New: Recent Activities
export const getRecentActivities = async (req, res) => {
  try {
    const userId = req.user._id;

    const recentInquiries = await Inquiry.find({ user: userId })
      .sort({ date: -1 })
      .limit(5)
      .select('inquirerName software status date')
      .lean();

    const recentWebsites = await Website.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('software startDate endDate state district palika')
      .lean();

    res.json({
      recentInquiries,
      recentWebsites
    });
  } catch (error) {
    console.error("Recent Activities Error:", error);
    res.status(500).json({ message: "Failed to fetch recent activities" });
  }
};