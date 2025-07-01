import express from 'express';
import {
  login,
  logout,
  signup,
  checkAuth,
  promoteToAdmin,
  getAllUsers,
} from '../controllers/auth.controller.js';
import { protectRoute, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

router.get("/check", protectRoute, checkAuth);

router.get('/users', protectRoute, isAdmin, getAllUsers);
router.put('/promote/:userId', protectRoute, isAdmin, promoteToAdmin);

export default router;
