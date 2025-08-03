import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getInquirySummary,
  getInquiriesByStatus,
  getMonthlyInquiries,
  getActionStats,
  getWebsitesByLocation,
  getConversionFunnel
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/inquiry-summary", protectRoute, getInquirySummary);
router.get("/inquiries-by-status", protectRoute, getInquiriesByStatus);
router.get("/monthly-inquiries", protectRoute, getMonthlyInquiries);
router.get("/action-stats", protectRoute, getActionStats);
router.get("/conversion-funnel", protectRoute, getConversionFunnel);

router.get("/websites-by-location", protectRoute, getWebsitesByLocation);

export default router;
