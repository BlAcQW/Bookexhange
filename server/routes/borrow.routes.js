import express from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate-request.js';
import {
  createBorrowRequest,
  getBorrowRequests,
  updateBorrowRequest,
} from '../controllers/borrow.controller.js';

const router = express.Router();

router.post(
  '/',
  auth,
  [
    body('bookId').notEmpty().withMessage('Book ID is required'),
  ],
  validateRequest,
  createBorrowRequest
);

router.get('/', auth, getBorrowRequests);

router.put(
  '/:id',
  auth,
  [
    body('status')
      .isIn(['pending', 'approved', 'rejected', 'completed'])
      .withMessage('Invalid status'),
  ],
  validateRequest,
  updateBorrowRequest
);

export default router;