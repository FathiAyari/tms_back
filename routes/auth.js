import express from 'express';
import { signup, signin } from '../controllers/authController.js';
import upload from "../middleware/upload.js";

const router = express.Router();

router.post('/signup', upload.single("image"),signup);
router.post('/signin', signin);

export default router;
