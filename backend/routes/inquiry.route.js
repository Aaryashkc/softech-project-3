import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createInquiry, deleteInquiry, getInquiries, updateInquiry } from "../controllers/inquiry.controller.js";

const router = express.Router();

router.get("/", protectRoute, getInquiries);

router.post("/", protectRoute, createInquiry);

router.put("/:id", protectRoute, updateInquiry);

router.delete("/:id", protectRoute, deleteInquiry);


export default router;
