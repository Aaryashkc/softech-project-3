import express from "express";
import {
  createWebsite,
  getWebsites,
  updateWebsite,
  deleteWebsite,
} from "../controllers/website.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getWebsites);

router.post("/", protectRoute, createWebsite);

router.put("/:id", protectRoute, updateWebsite);

router.delete("/:id", protectRoute, deleteWebsite);

// router.get("/admin-only", protectRoute, isAdmin, someAdminFunction);

export default router;
