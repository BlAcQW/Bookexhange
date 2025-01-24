import express from 'express';
import { body } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate-request.js';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from '../controllers/book.controller.js';

const router = express.Router();

router.post(
  '/',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('description')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters'),
    body('category')
      .trim()
      .notEmpty()
      .isIn(['Law', 'Nursing', 'Midwifery', 'Business', 'Pharmacy'])
      .withMessage('Invalid category'),
    body('condition')
      .trim()
      .notEmpty()
      .isIn(['New', 'Like New', 'Good', 'Fair', 'Poor'])
      .withMessage('Invalid condition'),
    body('price')
      .isNumeric()
      .withMessage('Price must be a number')
      .custom((value) => value >= 0)
      .withMessage('Price cannot be negative'),
  ],
  validateRequest,
  createBook
);

router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', auth, updateBook);
router.delete('/:id', auth, deleteBook);

export default router;