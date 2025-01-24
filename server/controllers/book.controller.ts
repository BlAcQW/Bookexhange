import { Request, Response } from 'express';
import Book from '../models/Book.js';

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const book = new Book({
      ...req.body,
      owner: req.user?.userId,
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error creating book' });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query = { ...query, category };
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const books = await Book.find(query).populate('owner', 'name email');
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books' });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id).populate('owner', 'name email');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book' });
  }
};

export const updateBook = async (req: AuthRequest, res: Response) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      owner: req.user?.userId,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    Object.assign(book, req.body);
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error updating book' });
  }
};

export const deleteBook = async (req: AuthRequest, res: Response) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      owner: req.user?.userId,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book' });
  }
};