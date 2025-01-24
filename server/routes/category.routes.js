import express from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate-request.js';
import {
  createCategory,
  getCategories,
} from '../controllers/category.controller.js';

const router = express.Router();

router.post(
  '/',
  auth,
  [
    body('name').trim().notEmpty().withMessage('Category name is required'),
    body('color').trim().notEmpty().withMessage('Color is required'),
  ],
  validateRequest,
  createCategory
);

router.get('/', getCategories);

export default router;