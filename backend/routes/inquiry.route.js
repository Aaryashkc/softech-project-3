import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createInquiry, deleteInquiry, getInquiries, updateInquiry, getSoftwareSuggestions } from "../controllers/inquiry.controller.js";

const router = express.Router();

router.get("/suggestions/software", protectRoute, getSoftwareSuggestions);

router.get("/", protectRoute, getInquiries);

router.post("/", protectRoute, createInquiry);

router.put("/:id", protectRoute, updateInquiry);

router.delete("/:id", protectRoute, deleteInquiry);


export default router;
